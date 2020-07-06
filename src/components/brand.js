import React, {useState, useEffect} from 'react';
import firebaseBD from "../firebase";
import moment from 'moment';
import * as firebase from "firebase";
import {Line} from 'react-chartjs-2';





const Brand = (props) => {
  var now = moment();
 var month = now.get("month")
  const  months = [{"Id": 0, "Month": "January"},
                      {"Id": 1, "Month": "February"},
                      {"Id": 2, "Month": "March"},
                      {"Id": 3, "Month": "April"},
                      {"Id": 4, "Month": "May"},
                      {"Id": 5, "Month": "June"},
                      {"Id": 6, "Month": "July"},
                      {"Id": 7, "Month": "August"},
                      {"Id": 8, "Month": "September"},
                      {"Id": 9, "Month": "October"},
                      {"Id": 10, "Month": "November"},
                      {"Id": 11, "Month": "December"}]
 

  function nextMonth() {
    if(selectedMonth.Id === 11){
  
         setMyMonth(months[11].Month)
    }else{
  setSelectedMonth(months[selectedMonth.Id + 1])
      setMyMonth(selectedMonth.Month)
      
    }
    data.labels = ['0','5'+selectedMonth.Month, '15'+selectedMonth.Month, '25'+selectedMonth.Month, '30'+selectedMonth.Month]
  

  }

   function previousMonth() {
     if(selectedMonth.Id === 0){
         setMyMonth(months[0].Month)

     } else{
           setSelectedMonth(months[selectedMonth.Id - 1])
           setMyMonth(selectedMonth.Month)
     }
    data.labels = ['0','5'+selectedMonth.Month, '15'+selectedMonth.Month, '25'+selectedMonth.Month, '30'+selectedMonth.Month]

   
  }

     function getBrand() {
   
    BRef.on('value', snapshot =>{
    if(snapshot.val() != null)
    setBrands({
        ...snapshot.val()
    })
   

     Object.keys(snapshot.val()).forEach(key => {
          if(key === brandId){
                setBrand({ ...snapshot.val()[key] })
                setOfferID(snapshot.val()[key].offerId)
          }
  
     });
        
     });
   
  }

   function getPurchaseByBrand() {
     var s = 0;
     var IDs = [];
     var newArr = [];
       purRef.orderByChild("offerId").equalTo(offerID).on("value", (snap) => {
                if(snap.val() != null){
                
                  setSalesNumber(Object.keys(snap.val()).length)
                  Object.keys(snap.val()).forEach(key => {

                //  if(moment(Number(snap.val()[key].createdAt)).get("month") == selectedMonth.Id){
                    s=s+snap.val()[key].amount;
                    IDs.push(snap.val()[key].influencer)
                 
                    
                  });
                  setSalesAmount(s.toFixed(2))
                newArr =  IDs.filter((a, b) => IDs.indexOf(a) === b)
                 setInfluencerIDs(newArr)
                 getInfluencers(newArr)
    
                }
    
});
   }

    function getPurchaseByInfluencer(listID,listINF) {
      var sInf = 0;
            var cmmAmount = 0;

      var ListsInf= []
      var ListcmmAmount= []
      var result= []
      const filterredIds = listID.filter(id => id!=null && id.length > 10);
filterredIds.map(id => {
     purRef.orderByChild("influencer").equalTo(id).on("value", (snap) => {
                if(snap.val() != null){
                                    Object.keys(snap.val()).forEach(key => {
                                      cmmAmount = 0;
                
 if(snap.val()[key].offerId == offerID ){
sInf = sInf+1;
cmmAmount = Number(snap.val()[key].commission) 
} 
                                    })

             ListsInf.push(sInf)
             ListcmmAmount.push(cmmAmount)
                     

                }

    if(ListsInf.length == filterredIds.length){
            

     result = listINF.map(function(el,pos) {
                  var o = Object.assign({}, el);
                  o.SalesNB = ListsInf[pos];
                   o.CommAmount = ListcmmAmount[pos];
                  return o;
                })

              

setInfluencers(result)


    }
});



})
  



   }


   function getInfluencers(Ids) {
const filterredIds = Ids.filter(id => id!=null && id.length > 10);
     var inf =[];
     var k = 0;
     
filterredIds.forEach(ID => {
if(ID != null){
InfRef.orderByKey().equalTo(ID).on('value', snapshot =>{
    if(snapshot.val() != null){
      k++;

  Object.keys(snapshot.val()).forEach(key => {
                inf.push(snapshot.val()[key].Profil)
  
     });



    }
   if(k ==  filterredIds.length){
 setInfluencers(inf)
     
      getPurchaseByInfluencer(Ids,inf)
     }
          


})
}


});

   }

     const  brandId  = props.match.params.id;
    
 
 const [brands, setBrands] = useState({});
 const [brand, setBrand] = useState(null);
 const [offerID, setOfferID] = useState(null);
 const [selectedMonth, setSelectedMonth] = useState(months[month]);
 const [myMonth, setMyMonth] = useState(months[month].Month);
 const [salesNumber, setSalesNumber] = useState(0);
 const [salesAmount, setSalesAmount] = useState(0);
 const [influencerIDs, setInfluencerIDs] = useState([]);
 const [influencers, setInfluencers] = useState([{}]);
  const [salesNumberInf, setSalesNumberInf] = useState([]);

const data = {
  labels: ['0','5'+myMonth, '15'+myMonth, '25'+myMonth, '30'+myMonth],
  datasets: [
    {
      label: 'Sales per month',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, salesNumber]
    }
  ]
};


 
const BRef = firebaseBD.ref("brands")
const dbRefS = firebaseBD.ref("conversions")
const purRef = dbRefS.child('purchase');
const InfRef = firebaseBD.ref("Influencers")


 useEffect(()=>{


      getBrand(); 

      if(brand!= null)
      getPurchaseByBrand();
   

 },[offerID,brandId])


 




    return (
        <div class="container">
  <div class="row">
    <div class="col"><img src={brand?.pic} height="200"  width="200"  alt="..."></img>
    </div>
    <div class="col">
<div class="sales">
    <h5>Sales Number</h5>
    <a>{salesNumber}</a>
    <h5>Sales Amount</h5>
     <a>{salesAmount} €</a>
</div>
    </div>
    <div class="col">
    <div>
        
        <Line data={data} />
      </div>
    </div>
  </div>
  <div class="namebrand">
  <div class="row">
    <div class="col">
    <h4>{brand?.name}</h4>
    </div>
    <div class="col"> 
       <a class="monthBtn" onClick={previousMonth}>
               <img class="back" src="https://img.pngio.com/arrows-next-right-last-forward-arrow-comments-arrow-png-icon-next-png-920_868.png"  width="25" height="25" ></img>
</a>
        <a>{myMonth}</a>
 <a  class="monthBtn" onClick={nextMonth}>
         <img src="https://img.pngio.com/arrows-next-right-last-forward-arrow-comments-arrow-png-icon-next-png-920_868.png"  width="25" height="25" ></img>

 </a>
    </div>
    <div class="col"></div>
  </div>
  </div>
 

  <table class="table">
  <thead>
    <tr>
      <th scope="col">Influencers</th>
      <th scope="col">Sales number</th>
      <th scope="col">Commissions amount</th>
      <th scope="col">Products number</th>
    </tr>
  </thead>
  <tbody>
  
{   influencers.map(influencer => 
      
(
 <tr key={influencer.affiliate_id}>
        <td>
      <div class="influ">
    <img src={influencer.banner} width="70" height="70" class="img-responsive pull-right"></img>
      <div class="email">
       <p>{influencer.name}</p>
        <p>{influencer.email}</p>
        </div>
</div>
      </td>
      <td>{influencer.SalesNB}</td>
      <td>{influencer.CommAmount}  €</td>
      <td>0</td>
    </tr>
)


      )}

   
   
  
  </tbody>
</table>

 
</div>
    )
}

export default Brand;