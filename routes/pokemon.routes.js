import { Router } from "express";
import { pokemonCollection, userPokemonCollection } from "../config/db.js";
import { ObjectId } from "mongodb";
import { ensureAuthenticated, authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * get lists of the pokemons a user owns
 */
router.get("/users", ensureAuthenticated, async (req, res) => {
  const userId = req.userId;
  console.log(userId)

  try {
    // Aggregation pipeline to join `userPokemonCollection` with `pokemonsCollection`
    const pokemons = await userPokemonCollection
      .aggregate([
        {
          $match: { userId: new ObjectId(userId) }, // Match user's Pokémon
        },
        {
          $lookup: {
            from: "pokemons", // Target collection for the join
            localField: "pokemonId", // Field in `userPokemonCollection`
            foreignField: "id", // Field in `pokemons` collection
            as: "pokemon", // Rename the joined field to 'pokemon'
          },
        },
        {
          $unwind: "$pokemon", // Flatten the `pokemon` array
        },
        {
          $project: {
            _id: 0, // Exclude the `_id` from the result
            pokemonId: 1,
            userId: 1,
            createdAt: 1,
            pokemon: 1,
          },
        },
      ])
      .toArray();
    console.log(pokemons)

    res.status(200).json({ pokemons });
  } catch (error) {
    console.error("Error fetching user’s Pokémon:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * get id lists of the pokemons a user owns
 */
router.get("/users/ids", authenticate, async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ pokemonIds: [] });
  }
  const userId = req.user.id;

  const pokemons = await userPokemonCollection
    .find({ userId: new ObjectId(userId) })
    .toArray();
  const pokemonIds = pokemons.map((pokemon) => pokemon.pokemonId);

  res.status(200).json({ pokemonIds });
});

/**
 * catch a pokemon
 */
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { pokemon } = req.body;
    const userId = req.userId;

    const { id: pokemonId, name, imageUrl } = pokemon;

    pokemonCollection.findOneAndUpdate(
      { name }, // Query: match by name
      {
        $set: pokemon,
        $setOnInsert: { createdAt: new Date() }, // Add createdAt only if inserting
      },
      { upsert: true, returnDocument: "after" } // Upsert and return the updated document
    );
    // Use findOneAndUpdate with upsert to catch the Pokémon
    const result = await userPokemonCollection.findOneAndUpdate(
      { pokemonId, userId }, // Query to check if this Pokémon is already caught by the user
      {
        $set: { pokemonId, userId: new ObjectId(userId) }, // Update fields if the Pokémon exists
        $setOnInsert: { createdAt: new Date() }, // Set only if this is a new insert
      },
      { upsert: true, returnDocument: "after" } // Insert if not found, and return the updated document
    );

    res.status(201).json({
      message: "Pokémon caught successfully!",
      pokemon: result, // Contains the inserted document
    });
  } catch (error) {
    console.error("Error catching Pokémon:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * create pokemon team
 */
router.post("/", ensureAuthenticated, async (req, res) => {
  const userId = req.userId;
});

export default router;
