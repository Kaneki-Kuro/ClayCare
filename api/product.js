const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI; // from .env / Vercel env
let cachedClient = null;

async function connect(){
  if(cachedClient) return cachedClient;
  const client = new MongoClient(uri, { useNewUrlParser:true, useUnifiedTopology:true });
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  if(req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  try{
    const client = await connect();
    const db = client.db(process.env.MONGODB_DB || 'claycare');
    const coll = db.collection('products');
    // For single-product store, fetch the first product
    const prod = await coll.findOne({}) || {
      title:'ClayCare Multani Mitti Soap',
      short:'Natural Multani Mitti soap (100g) — handmade',
      price:99,
      weight:'100g',
      image:'/assets/logo.png'
    };
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return res.json(prod);
  }catch(err){
    console.error(err);
    return res.status(500).json({error:'internal'});
  }
};
