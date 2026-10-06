const units = new Set(['g', 'kg', 'ml', 'L', 'unités']);
const courses = new Set(['Entrées', 'Plats', 'Desserts', 'Encas & à emporter']);
const tags = new Set(['Végétarien', 'Vegan', 'Sans gluten']);
const allergens = new Set(['Gluten', 'Lait', 'Œuf', 'Poisson', 'Fruits à coque', 'Soja', 'Arachides', 'Céleri', 'Moutarde', 'Sésame', 'Sulfites', 'Lupin', 'Mollusques', 'Crustacés']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const text = (value, maximum) => typeof value === 'string' && value.trim().length > 0 && value.length <= maximum;
const integer = (value, maximum) => Number.isInteger(value) && value >= 1 && value <= maximum;
const list = (value, maximum) => Array.isArray(value) && value.length >= 1 && value.length <= maximum;
const unique = values => values.every(value => typeof value === 'string') && new Set(values.map(value => value.toLowerCase())).size === values.length;
function requireValid(condition, context) { if (!condition) throw new Error(`Catalogue StockChef invalide : ${context}`); }

export function validateRecipeFeed(feed) {
  requireValid(Buffer.byteLength(JSON.stringify(feed), 'utf8') <= 2_000_000, 'limite de 2 Mo');
  requireValid(feed?.schemaVersion === 1 && list(feed.recipes, 1000), 'version ou recettes');
  requireValid(unique(feed.recipes.map(recipe => recipe.id)), 'identifiants de recettes dupliqués');
  for (const recipe of feed.recipes) {
    requireValid(uuid.test(recipe.id) && text(recipe.title, 200), 'identifiant ou titre');
    requireValid(integer(recipe.baseServings, 100) && integer(recipe.prepTimeMinutes, 1440), recipe.title);
    requireValid(courses.has(recipe.course), `${recipe.title} : catégorie`);
    requireValid(list(recipe.instructions, 100) && recipe.instructions.every(step => text(step, 4000)), `${recipe.title} : étapes`);
    requireValid(Array.isArray(recipe.dietaryTags) && recipe.dietaryTags.every(tag => tags.has(tag)), `${recipe.title} : régimes`);
    requireValid(Array.isArray(recipe.allergens) && recipe.allergens.every(allergen => allergens.has(allergen)), `${recipe.title} : allergènes`);
    requireValid(list(recipe.ingredients, 100) && unique(recipe.ingredients.map(ingredient => ingredient.id)), `${recipe.title} : ingrédients`);
    for (const ingredient of recipe.ingredients) {
      requireValid(uuid.test(ingredient.id) && text(ingredient.name, 200) && units.has(ingredient.unit) && typeof ingredient.isPantryStaple === 'boolean', `${recipe.title} : ${ingredient.name}`);
      requireValid(Number.isFinite(ingredient.baseQuantity) && ingredient.baseQuantity > 0 && ingredient.baseQuantity <= 1_000_000, `${recipe.title} : quantité`);
    }
  }
  return feed;
}