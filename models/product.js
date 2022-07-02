const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model("Product", productSchema);



// const getDb = require("../util/database").getDb;

// // const fs = require('fs');
// // const path = require('path');

// // const p = path.join(
// //   path.dirname(process.mainModule.filename),
// //   'data',
// //   'products.json'
// // );

// // const getProductsFromFile = cb => {
// //   fs.readFile(p, (err, fileContent) => {
// //     if (err) {
// //       cb([]);
// //     } else {
// //       cb(JSON.parse(fileContent));
// //     }
// //   });
// // };

// module.exports = class Product {
//   constructor(title, imageUrl, description, price) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save () {
//     db = getDb();
//     return db.collection("products").insertOne(this);
//  }
 
// }

// //   save() {
// //     getProductsFromFile(products => {
// //       if(this.id) {
// //         const existingProductIndex = products.findIndex(prod => prod.id === this.id);
// //         const updatedProducts = [...products];
// //         updatedProducts[existingProductIndex] = this;
// //         fs.writeFile(p, JSON.stringify(updatedProducts), err => console.log(err));
// //       } else {
// //         this.id = Math.random().toString();
// //         products.push(this);
// //         fs.writeFile(p, JSON.stringify(products), err => console.log(err));
// //       }
// //     });
// //   }

// //   static fetchAll(cb) {
// //     getProductsFromFile(cb);
// //   }

// //   static findById(id, cb) {
// //     getProductsFromFile(products => {
// //       const product = products.find(p => p.id === id);
// //       cb(product);
// //     });
// //   }
  
// // //   static deleteProduct (id) {
// // //     getProductsFromFile(products => {
// // //       // const productIndex = products.findIndex(product => product.id === id);
// // //       const productsForDelete = products.filter(prod => prod.id !== id);
// // //       fs.writeFile(p, JSON.stringify(productsForDelete), err => console.log(err));
// // //     });
// // // }

// // static deleteProduct (id) {
// //   getProductsFromFile(products => {
// //     let updatedProducts = products.filter(prod => prod.id !== id);
// //     fs.writeFile(p, JSON.stringify(updatedProducts), err => console.log(err));
// //   })
// // };
// // };