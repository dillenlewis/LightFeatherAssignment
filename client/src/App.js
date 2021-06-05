import React from 'react'
import './App.css';


function App() {
  const [names, setNames] = React.useState([])
  const [fname, setFName] = React.useState("")
  const [lname, setLName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [email_checked, setEmail_Checked] = React.useState(true)
  const [phone_checked, setPhone_Checked] = React.useState(false)
  const [supervisor, setSupervisor] = React.useState("")
  const [submittedForm, setSubmittedForm] = React.useState(false)

 
  React.useEffect(()=>{
    async function fetchSupers(){
      const response = await fetch("https://6099a4760f5a13001721985c.mockapi.io/api/supervisors")
      const supers = await response.json()
      
      let arr = []

      supers.results.forEach(element=>{
        arr.push(`${element.name.first} ${element.name.last}`)
      })
      setNames(arr)
    }  
    fetchSupers()
  }, [])


  const handleCheckboxChange = () =>{
    if(email_checked === false && phone_checked === true){
      setEmail_Checked(true)
      setPhone_Checked(false)
      setPhone("")
      document.getElementById("email").required = true;
      document.getElementById("phone").required = false; 
    }else{
      setEmail_Checked(false)
      setPhone_Checked(true)
      setEmail("")
      document.getElementById("email").required = false;
      document.getElementById("phone").required = true;
    }
  }


  const handleSubmit = async event =>  {
    event.preventDefault();
    try{
      const response = await fetch('https://6099a4760f5a13001721985c.mockapi.io/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName : fname,
          lastName : lname,
          email: email,
          phoneNumber: phone,
          supervisor: supervisor
        }),
      })
      return response.json();
    }
    catch(err){
      console.log(err)
    }

    setSubmittedForm(true) 
  }

 
  //Populates the supervisor dropdown
  React.useEffect(()=>{
    let selectElement = document.getElementById("supervisors")
    let docfrag = document.createDocumentFragment()

    for(let i = 0; i < names.length; i++){
      let option = document.createElement('option')  
      option.value = names[i]
      option.appendChild(document.createTextNode(`${names[i]}`));
      docfrag.appendChild(option)
    }
    selectElement.appendChild(docfrag)
  }, [names])

  
  return (
    <div>
      <div className="formheader">Notification Form</div>
      {submittedForm === false ? (
      <form className="data" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fname">First Name</label>
          <input type="text" value={fname} onChange={(event)=> setFName(event.target.value)} id='fname' name='fname' className='fname' pattern="[A-Za-z]+" autoFocus required/>
        </div>
        <div>
          <label htmlFor="lname">Last Name</label>
          <input type="text" value={lname} onChange={(event)=> setLName(event.target.value)} id='lname' name='lname' className='lname' pattern="[A-Za-z]+" required/>
        </div>
        <div className="text">How would you prefer to be notified?</div>
        <div>
          <input type="checkbox" id="checkboxemail" name="checkboxemail" value="foremail" checked={email_checked} onChange={handleCheckboxChange}/>
          <label htmlFor="email">Email</label>
          <input type="email" value={email} onChange={(event)=> setEmail(event.target.value)} id='email' name='email' className='email' required/>
        </div>
        <div>
          <input type="checkbox" id="checkboxphone" name="checkboxphone" value="forphone" checked={phone_checked} onChange={handleCheckboxChange}/>
          <label htmlFor="phone">Phone Number x-xxx-xxx-xxxx </label>
          <input type="tel" value={phone} onChange={(event)=> setPhone(event.target.value)} id='phone' name='phone' className='phone' pattern="[0-9]{1}-[0-9]{3}-[0-9]{3}-[0-9]{4}"/>
        </div>
        <div>
          <label htmlFor="supervisors">Supervisor</label>
          <select id="supervisors" name="supervisors" className='supervisors' onChange={(event)=> setSupervisor(event.target.value)} required>
          <option value="" disabled selected>Please select a name...</option>
          </select>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>) : (
        <div className="formCompleted">Form has been submitted</div>)}
    </div>  
  );
}

export default App;
