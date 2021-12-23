import { React, useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash'

const App = () => {
  
  const d = {
    fname: '',
    lname: '',
    mname: '',
    filter: '',
    filterName: '',
    address:'',
    phone:'',
    email:'',
    gender:''
    
  }

  const [names, setNames] = useState([]);
  const [disabledSubmit, setdisabledSubmit] = useState(true);
  const [formFields, setFormFields] = useState(d);
  const [choices, setChoices ] = useState([]);
  const [isEditing, setEditing] = useState(false);
  const [staticss, setStatic] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // axios.post('http://localhost:8080/', formFields)
    // .then(response => setNames(response.data))
    
    try {
      const r = await axios.post('http://localhost:8080/', formFields)
      setNames(r.data)
      setFormFields(d)
    } catch (error) {
      console.log(error)
    }

    // alert(`${formFields.fname} ${formFields.mname} ${formFields.lname}`)
  }
    useEffect (() => {
    if (formFields.fname !== '' && formFields.lname !== '')  {
      setdisabledSubmit(false);
    } else {
      setdisabledSubmit(true);
    }
  }, [formFields.fname, formFields.lname]);
  

  const updateFilter = (filter) => {
    const b = [];

    let filterdNames = _.uniqBy(staticss, filter);

    filterdNames.forEach(n => {
      if (typeof n[filter] === 'string') {
        b.push({ key: n[filter], val: n[filter].charAt(0).toUpperCase() + n[filter].slice(1)})
      }
    })
    setChoices(b)
    console.log(b)
  }

  const goHandler = async () => {
    // const t = { params: {  filterName: formFields.filterName, filterValue: formFields.filter } };
    // const s = await axios.get('http://localhost:8080/', t)
    let s = names.filter(n => n[formFields.filterName] === formFields.filter)
    setNames(s)
  }

   const handleChange = (evt) => {
    setFormFields({ ...formFields, [evt.target.name]: evt.target.value })
  }

  useEffect (() => {
    if (formFields.filterName !== '' && formFields.filter !== '')  {
      goHandler()
    } else {
      setNames(staticss);
    }
  }, [formFields.filterName, formFields.filter])

  useEffect (() => {
    fetch('http://localhost:8080')
    .then(response => response.json())
    .then(data => {
      setStatic(data);
      setNames(data)
    })
  }, [])

  return (
    <>
      <div className="App">
        <form onSubmit={(e) => submitHandler(e)}>
          <label>
            <h1>Application Form</h1>
            First Name: <input type="text" name="fname" value={formFields.fname} onChange={handleChange} />
            Middle Name: <input type="text" name="mname" value={formFields.mname} onChange={handleChange} />
            Last Name: <input type="text" name="lname" value={formFields.lname} onChange={handleChange} />
             <br/>Address: <input type="text" name="address" value={formFields.address} onChange={handleChange} />
             <br/>Email: <input type="email" name="email" value={formFields.email} onChange={handleChange} required/>
             <br/>Mobile Number:<input type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        value={formFields.phone} onChange={handleChange}required/>
        <p>Select </p>  
              <input type="radio" name="gender" value="male" onChange={handleChange}/> Male   
              <input type="radio" name="gender" value="female" onChange={handleChange}/> Female <br/>  
              <button type="submit" name="button" value="Submit" disabled={disabledSubmit}>Submit</button>
          </label>
          </form>
          <br />
          <div>
           <label htmlFor="Name">Choose a Name:</label>
        <select name="filterName" id="Names" value={formFields.filterName} onChange={(e) => { handleChange(e); updateFilter(e.target.value) }}>
        <option value="">Select a filter</option>
          <option value="fname">Fname</option>
          <option value="mname">Mname</option>
          <option value="lname">Lname</option>
          <option value="address">Address</option>
          <option value="phone">Mobile Number</option>
          <option value="email">Email</option>
          <option value="gender">Gender</option>
        </select>
           </div>
        <select name="filter" id="data" onChange={handleChange} >
        <option value="">Select data</option>
          {
            choices.map((c, i) =>
              <option key={i+1} value={c.key}>{c.val} </option>
            )
          }
        </select> 
         <br/>  <br/>

         <button type="button" name="button" value="edit" onClick={() => setEditing(false)}>Edit</button>

      {/* const setEditing=(id, newName) = {
                tasks.map(task => {
        if (id === task.id) {
          return {
            ...task,
            name: newName
         }
      }
      return task;
   });
   */}

  <table> 
          <thead>
            <tr>
              <th>Fname</th>
              <th>Mname</th>
              <th>Lname</th>
              <th>Address</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {names.map((name, i) => 
              <tr key={i+1}>
                <td>{(name.fname)}</td>
                <td>{(name.mname)}</td>
                <td>{(name.lname)}</td>
                <td>{(name.address)}</td>
                <td>{(name.phone)}</td>
                <td>{(name.email)}</td>
                <td>{(name.gender)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
};

export default App;
