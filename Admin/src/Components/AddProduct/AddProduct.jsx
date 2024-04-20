import { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '', // changed from img to image
    category: 'coffee-products',
    new_price: '',
    old_price: ''
  })
 
  const imghandler = (e) => {
    setImage(e.target.files[0]);
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
  }

  const addProduct = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product', image);

    await fetch('http://localhost:8000/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: formData,
    })
    .then((res) => res.json())
    .then(async (data) => { 
      responseData = data;
      if (responseData.success) {
        product.image = responseData.image_url; // updated from product.img to product.image
        console.log(product);
        await fetch('http://localhost:8000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }, 
          body: JSON.stringify(product),
        }).then((res) => res.json()).then((data) => {
          data.success ? alert('Product Added') : alert('Failed')
        })
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here'/>
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder='Type here'/>
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="coffee-products">Coffee Products</option>
          <option value="brewing-equipments">Brewing Equipments</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor='file-input'>
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
        </label>
        <input type='file' onChange={imghandler} name='image' id='file-input' hidden/> {/* updated name to image */}
      </div>
      <button onClick={addProduct} className="addproduct-btn">ADD PRODUCT</button>
    </div>
  )
}

export default AddProduct