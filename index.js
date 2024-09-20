const nunjucks = require('nunjucks');
const express = require('express');
const axios = require('axios');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

// Configure Nunjucks
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    autoescape: true,
    noCache: process.env.NODE_ENV === 'development'
});

app.set('view engine', 'njk');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Set local variables
app.locals.version = require('./package.json').version;

// Helper function to get metadata URL
const getMetadataUrl = () => {
    return process.env.NODE_ENV === 'development'
        ? `http://127.0.0.1:${PORT}/js/metadata.json`
        : 'http://169.254.170.2/v2/metadata';
};

// Helper function to find container
const findRelevantContainer = (containers) => {
    return containers.find(container => !container.Image.includes('tinyproxy'));
};

// Routes
app.get('/', async (req, res) => {
    try {
        const url = getMetadataUrl();
        const { data } = await axios.get(url);
        
        const container = findRelevantContainer(data.Containers);
        
        if (!container) {
            throw new Error('No relevant container found');
        }

        res.render('index', {
            url,
            data: JSON.stringify(data, null, 2),
            image: container.Image,
            network: container.Networks[0].NetworkMode,
            address: container.Networks[0].IPv4Addresses[0]
        });
    } catch (err) {
        console.error('Error fetching metadata:', err);
        res.status(500).json({
            code: err.code || 'INTERNAL_SERVER_ERROR',
            message: err.message || 'An unexpected error occurred'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});