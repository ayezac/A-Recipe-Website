import React, { useState } from "react";
import Layout from "../components/Layout";
import Head from "next/head";
import axios from "axios";
import Router from "next/router";
import LoginMessage from "../components/Login/LoginMessage";
import Cookies from "js-cookie";
import { baseUrl } from "../services/baseUrl";

const RecipeForm = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [method, setMethod] = useState("");
  const [ingredientList, setIngredientList] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [quantity, setQuantity] = useState("");
  const [alert, setAlert] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);

  const token = Cookies.get("token");

  const handleAddIngredient = e => {
    e.preventDefault();
    let ingredientObject = {};
    ingredientObject["item"] = ingredient;
    ingredientObject["quantity"] = quantity;
    ingredientList.push(ingredientObject);
    setIngredientList(ingredientList);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 2000);
    setIngredient("");
    setQuantity("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const toBase64 = image =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

    const data = {
      title: title,
      image: await toBase64(image),
      ingredients: ingredientList,
      method: method
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`
    };
    try {
      const response = await axios.post(`${baseUrl}recipes/add_recipe/`, data, {
        headers
      });
      if (response.status === 201) {
        Router.push({
          pathname: "/myrecipes"
        });
      }
    } catch (error) {
      console.log(error);
      setErrorDialog(true);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Add A Recipe </title>
      </Head>
      {token && (
        <form>
          {errorDialog && (
            <div className="alert alert-danger" role="alert">
              <strong>An Error Occurred! </strong>
              Make sure you entered all the fields and try again.
            </div>
          )}
          <div>
            <div className="form-group">
              <label htmlFor="recipe-title" className="font-weight-bold">
                Name of Recipe:
              </label>
              <input
                type="text"
                name="title"
                id="recipe-title"
                className="form-control"
                required
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="recipe-image" className="font-weight-bold">
                Image for Recipe
              </label>
              <input
                type="file"
                name="recipe-image"
                accept="file_extension|image/*"
                className="form-control"
                placeholder="Add an image for your recipe"
                onChange={e => {
                  setImage(e.target.files[0]);
                }}
              />
            </div>
            {image && <img src={image} alt="uploaded image" />}

            <div className="form-group">
              <label htmlFor="method" className="font-weight-bold">
                Method:
              </label>
              <textarea
                rows="10"
                name="method"
                id="method"
                className="form-control"
                required
                onChange={e => setMethod(e.target.value)}
              />
            </div>
            <div>
              <div className="ingredients-container">
                <p className="font-weight-bold">Add Ingredients:</p>
                <div className="form-inline">
                  <input
                    type="text"
                    id="ingredient"
                    placeholder="name of ingredient"
                    required
                    className="form-control mb-2 mr-sm-2"
                    value={ingredient}
                    onChange={e => setIngredient(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="quantity"
                    id="quantity"
                    className="form-control mb-2 mr-sm-2"
                    required
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                  />

                  <button
                    onClick={handleAddIngredient}
                    className="btn btn-primary"
                  >
                    Add ingredient
                  </button>
                  {alert && (
                    <div className="alert alert-success" role="alert">
                      Added!
                    </div>
                  )}
                </div>
              </div>
              <div>
                <ol>
                  {ingredientList.map((item, id) => (
                    <li key={id} className="ingredient">
                      <strong>{item.item}</strong> --- {item.quantity}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <button onClick={handleSubmit} className="btn btn-primary mb-2">
              Submit Recipe
            </button>
          </div>
        </form>
      )}
      {!token && <LoginMessage />}

      <style jsx>
        {`
          form {
            width: 70%;
            margin: auto;
            text-align: center;
            color: #fa5091;
          }
          .btn {
            margin: 20px;
            background-color: #fa5091;
            border: 1px solid #fa5091;
          }
          .form-inline {
            width: 90%;
            margin: auto;
            text-align: center;
          }
          .alert {
            display: inline-block;
          }
          ol {
            text-align: left;
          }
          .ingredient {
            color: black;
          }
        `}
      </style>
    </Layout>
  );
};

export default RecipeForm;
