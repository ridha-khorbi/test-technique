import React, {useState, useEffect} from 'react';
import firebaseBD from "../firebase"
import * as firebase from "firebase";


const Brands = () => {
 
 const [brands, setBrands] = useState({});
 useEffect(()=>{


firebaseBD.child('brands').on('value', snapshot =>{
    if(snapshot.val() != null)
    setBrands({
        ...snapshot.val()
    })
})
 },[])

 console.log("list of brandd",brands)

    return (
        <div className="container" >
        <h1> List of brand</h1>
         </div>
    )
}

export default Brands;