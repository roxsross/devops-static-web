#!/usr/bin/python
from fastapi import FastAPI, Response, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import requests
import asyncio
import os
import uvicorn
import logging
from functools import lru_cache
import json

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PokeAPI Enhanced",
    description="Una API mejorada para obtener información de Pokémon",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lista expandida de Pokémon
POKEMONS = [
    "spearow", "fearow", "ekans", "arbok", "pikachu",
    "raichu", "sandshrew", "sandslash", "nidorina", "nidoqueen",
    "vulpix", "ninetales", "jigglypuff", "wigglytuff", "zubat",
    "golbat", "oddish", "gloom", "vileplume", "paras"
]

@lru_cache(maxsize=128)
def get_cached_pokemon_data(pokemon_name: str):
    """Cache para evitar llamadas repetidas a la API externa"""
    try:
        response = requests.get(f"https://pokeapi.co/api/v2/pokemon/{pokemon_name}", timeout=10)
        species_response = requests.get(f"https://pokeapi.co/api/v2/pokemon-species/{pokemon_name}", timeout=10)
        
        if response.status_code == 200 and species_response.status_code == 200:
            return response.json(), species_response.json()
    except requests.RequestException as e:
        logger.error(f"Error fetching data for {pokemon_name}: {e}")
    return None, None

def process_pokemon_data(pokemon_data: dict, species_data: dict) -> Dict[str, Any]:
    """Procesa los datos del Pokémon para el formato de respuesta"""
    try:
        # Buscar descripción en español, inglés como fallback
        description = "No description available"
        for entry in species_data.get("flavor_text_entries", []):
            if entry["language"]["name"] == "es":
                description = entry["flavor_text"].replace('\n', ' ').replace('\f', ' ')
                break
            elif entry["language"]["name"] == "en":
                description = entry["flavor_text"].replace('\n', ' ').replace('\f', ' ')
        
        return {
            "id": pokemon_data["id"],
            "name": pokemon_data["name"].title(),
            "sprites": {
                "front_default": pokemon_data["sprites"]["front_default"],
                "back_default": pokemon_data["sprites"]["back_default"],
                "front_shiny": pokemon_data["sprites"]["front_shiny"],
                "back_shiny": pokemon_data["sprites"]["back_shiny"]
            },
            "description": description,
            "height": pokemon_data["height"],
            "weight": pokemon_data["weight"],
            "types": [t["type"]["name"].title() for t in pokemon_data["types"]],
            "abilities": [a["ability"]["name"].title() for a in pokemon_data["abilities"]],
            "stats": {stat["stat"]["name"]: stat["base_stat"] for stat in pokemon_data["stats"]},
            "moves_count": len(pokemon_data["moves"])
        }
    except Exception as e:
        logger.error(f"Error processing pokemon data: {e}")
        return None

@app.get("/")
async def root():
    """Endpoint raíz con información de la API"""
    return {
        "message": "¡Bienvenido a la PokeAPI Mejorada!",
        "version": "2.0.0",
        "endpoints": {
            "all_pokemons": "/api/v1/all_pokemons",
            "pokemon_detail": "/api/v1/pokemon/{name}",
            "pokemon_abilities": "/api/v1/pokemon/{name}/abilities",
            "search": "/api/v1/search",
            "stats": "/api/v1/stats"
        },
        "docs": "/docs"
    }

@app.get("/api/v1/all_pokemons")
async def get_all_pokemons(
    limit: int = Query(default=20, ge=1, le=50, description="Número de Pokémon a obtener"),
    include_shiny: bool = Query(default=False, description="Incluir sprites shiny")
):
    """Obtiene todos los Pokémon"""
    try:
        pokemon_list = POKEMONS[:limit]
        results = []
        
        for pokemon_name in pokemon_list:
            pokemon_data, species_data = get_cached_pokemon_data(pokemon_name)
            
            if pokemon_data and species_data:
                processed_data = process_pokemon_data(pokemon_data, species_data)
                if processed_data:
                    if not include_shiny:
                        # Remover sprites shiny si no se solicitan
                        processed_data["sprites"].pop("front_shiny", None)
                        processed_data["sprites"].pop("back_shiny", None)
                    results.append(processed_data)
        
        return {
            "success": True,
            "results": results,
            "count": len(results),
            "message": f"Se obtuvieron {len(results)} Pokémon exitosamente"
        }
        
    except Exception as e:
        logger.error(f"Error in get_all_pokemons: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.get("/api/v1/pokemon/{pokemon_name}")
async def get_pokemon_detail(pokemon_name: str):
    """Obtiene información detallada de un Pokémon específico"""
    try:
        pokemon_data, species_data = get_cached_pokemon_data(pokemon_name.lower())
        
        if pokemon_data and species_data:
            processed_data = process_pokemon_data(pokemon_data, species_data)
            if processed_data:
                return {
                    "success": True,
                    "results": [processed_data],
                    "message": f"Información de {pokemon_name.title()} obtenida exitosamente"
                }
        
        raise HTTPException(status_code=404, detail=f"El Pokémon {pokemon_name} no fue encontrado")
                
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting pokemon detail: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.get("/api/v1/pokemon/{pokemon_name}/abilities")
async def get_pokemon_abilities(pokemon_name: str):
    """Obtiene las habilidades de un Pokémon específico"""
    try:
        url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_name.lower()}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            abilities = []
            
            for ability in data["abilities"]:
                ability_name = ability["ability"]["name"].title()
                is_hidden = ability.get("is_hidden", False)
                abilities.append({
                    "name": ability_name,
                    "is_hidden": is_hidden,
                    "slot": ability["slot"]
                })
            
            return {
                "success": True,
                "results": abilities,
                "count": len(abilities),
                "message": f"Habilidades de {pokemon_name.title()} obtenidas exitosamente"
            }
        elif response.status_code == 404:
            raise HTTPException(status_code=404, detail="El Pokémon solicitado no existe")
        else:
            raise HTTPException(status_code=503, detail="Servidor no disponible en este momento")
                    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting abilities: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.get("/api/v1/search")
async def search_pokemon(
    q: str = Query(..., min_length=1, description="Término de búsqueda"),
    exact: bool = Query(default=False, description="Búsqueda exacta")
):
    """Busca Pokémon por nombre"""
    try:
        if exact:
            matches = [p for p in POKEMONS if p.lower() == q.lower()]
        else:
            matches = [p for p in POKEMONS if q.lower() in p.lower()]
        
        results = []
        for pokemon_name in matches:
            pokemon_data, species_data = get_cached_pokemon_data(pokemon_name)
            if pokemon_data and species_data:
                processed_data = process_pokemon_data(pokemon_data, species_data)
                if processed_data:
                    results.append(processed_data)
                
        return {
            "success": True,
            "results": results,
            "count": len(results),
            "message": f"Se encontraron {len(results)} Pokémon que coinciden con '{q}'"
        }
            
    except Exception as e:
        logger.error(f"Error in search: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.get("/api/v1/stats")
async def get_api_stats():
    """Obtiene estadísticas de la API"""
    return {
        "total_pokemon_available": len(POKEMONS),
        "pokemon_list": POKEMONS,
        "api_version": "2.0.0",
        "features": [
            "Cache inteligente",
            "Búsqueda avanzada",
            "Sprites shiny opcionales",
            "Información detallada",
            "Manejo de errores mejorado"
        ]
    }

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"success": False, "message": "Endpoint no encontrado"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Error interno del servidor"}
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host='0.0.0.0',
        port=port,
        reload=True,
        log_level="info"
    )