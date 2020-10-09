const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpire: String,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (prodId) {
  const updatedCartItems = this.cart.items.filter((p) => {
    return p.productId.toString() !== prodId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// module.exports = class Users {
//   constructor(username, email, cart, _id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // { items: [] }
//     this._id = _id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   // updatedCart() {
//   //   const db = getDb();
//   //   const prodId = this.cart.items.map((p) => {
//   //     return p.productId;
//   //   });
//   //   console.log("prodid", prodId);
//   //   let filterProduct;
//   //     return db
//   //       .collection("products")
//   //       .find()
//   //       .toArray()
//   //       .then((products) => {
//   //         return prodId.forEach((pId) => {
//   //           filterProduct = products.filter((prod) => {
//   //             console.log(prod._id, pId);
//   //             return prod._id.toString() !== pId.toString();
//   //           })
//   //       });
//   //       console.log(filterProduct)
//   //   });
//   //   // return filterProduct
//   // }

//   getCart() {
//     const db = getDb();
//     const productId = this.cart.items.map((p) => {
//       return p.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productId } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           item: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//             email: this.email,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db.collection("users").updateOne(
//           {
//             _id: new ObjectId(this._id),
//           },
//           { $set: { cart: { items: [] } } }
//         );
//       });
//   }

//   deleteItemFromCart(prodId) {
//     const updatedCartItems = this.cart.items.filter((p) => {
//       return p.productId.toString() !== prodId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection("users").findOne({ _id: new ObjectId(id) });
//   }
// };
