import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../Utility/firebase"; // Firestore + Storage instances
import { DataContext } from "../../components/DataProvider/DataProvider"; // Global state (to know who is selling)
import LayOut from "../../components/LayOut/LayOut"; // Header/layout wrapper
import { ClipLoader } from "react-spinners"; // Loading spinner
import classes from "./AddProduct.module.css"; // Styles

// Page that lets a logged-in user upload a product that everyone can see.
function AddProduct() {
  const [{ user }] = useContext(DataContext); // Current signed-in user
  const navigate = useNavigate();

  // Form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle form submission: optionally upload an image, then save to Firestore.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic validation
    if (!title || !price) {
      setMessage("Please add at least a title and a price.");
      return;
    }

    setLoading(true);
    try {
      let finalImage = imageUrl.trim();

      // If the user picked a file, upload it to Firebase Storage and use its URL.
      if (imageFile) {
        const storageRef = storage.ref(
          `products/${Date.now()}_${imageFile.name}`
        );
        const snapshot = await storageRef.put(imageFile);
        finalImage = await snapshot.ref.getDownloadURL();
      }

      // Fall back to a placeholder if no image was provided.
      if (!finalImage) {
        finalImage = "https://via.placeholder.com/300x300?text=No+Image";
      }

      // Save the product so every shopper can see it.
      await db.collection("products").add({
        title: title.trim(),
        price: Number(price),
        category: category.trim() || "general",
        description: description.trim(),
        image: finalImage,
        rating: { rate: 0, count: 0 },
        seller: user?.email || "anonymous",
        createdAt: Date.now(),
      });

      setMessage("\u2705 Product added! Redirecting to the homepage...");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong: " + err.message);
      setLoading(false);
    }
  };

  return (
    <LayOut>
      <div className={classes.addProduct}>
        <h1>Sell an item</h1>
        <p className={classes.subtitle}>
          Add a product and it will instantly appear on the homepage for all
          shoppers.
        </p>

        <form className={classes.form} onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Vintage denim jacket"
            />
          </label>

          <label>
            Price (USD)
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 29.99"
            />
          </label>

          <label>
            Category
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. men's clothing"
            />
          </label>

          <label>
            Description
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item..."
            />
          </label>

          <label>
            Upload image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>

          <div className={classes.or}>\u2014 or \u2014</div>

          <label>
            Image URL (optional)
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? <ClipLoader color="#111" size={16} /> : "Publish item"}
          </button>

          {message && <p className={classes.message}>{message}</p>}
        </form>
      </div>
    </LayOut>
  );
}

export default AddProduct;
