import mongoose from 'mongoose';

// THIS IS BROKEN, for some reason
// mongoose does not import correctly here
const removeAllCollections = async () => {
  if (mongoose == null || mongoose == undefined) {
    console.log("what");
  }
  const collections = Object.keys(mongoose.connection.collections);

  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].deleteMany({});
  }
};

export {removeAllCollections as removeAllCollections};