import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {getContact} from '../api/ContactService'
import { toastError, toastSuccess } from '../api/ToastService';
const ContactDetails = ({updateContact , updateImage}) => {
    const photoRef = useRef();
   

    const [contact, setContact] = useState({
        id: '',
        name : '',
        email : '',
        phone: '',
        address : '',
        title:'',
        status: '',
        photoUrl: ''
    });

    const onChange =(event)=>{
        setContact({ ...contact, [event.target.name]: event.target.value});
        
    }

    const handleUpdateContact = async(event) => {
        event.preventDefault();
        await updateContact(contact)

        getContact(id);
        toastSuccess("Update Successful")

    }
        const {id} = useParams();
        
        const handleGetContact = async (id) => {
            
            try{
              const {data} = await getContact(id);
              setContact(data)
            }catch(error){
              console.error(error)
              toastError("An error occurred, please try again later");
            }
          }

        const selectPhoto = ()=> {
            photoRef.current.click();
        }

        const updatePhoto =async (file) => {
            await updateImage(id, file);
            
            photoRef.current.value = null;
            setContact((prev)=> ({...prev, photoUrl :`${prev.photoUrl}?timestamp=${new Date().getTime()}`}))

            
            
        }

          useEffect(() => {
            handleGetContact(id);
          },[])


    return (
        <>
            <Link to={'/'} className='link'><i className="bi bi-arrow-left"></i> Back To Home</Link>
            <div className='profile'>
                <div className='profile__details'>
                    <img src={contact.photoUrl} alt={`Profile photo of${contact.name}`} />
                    <div className='profile__metadata'>
                        <p className='profile__name'>{contact.name}</p>
                        <p className='profile__muted'>JPG, GIF or PNG. Max size of 10MB</p>
                        <button  onClick={selectPhoto} className='btn'><i className='bi bi-cloud-upload'></i>Change Photo</button>
                    </div>

                </div>
                <div className='profile__settings'>
                    <div>
                        <form className="form" onSubmit={handleUpdateContact}>
                            <div className="user-details">
                                <input type="hidden" name="id" required defaultValue={contact.id} />
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" name="name" value={contact.name} onChange={onChange} required />

                                </div>
                                <div className="input-box">
                                    <span className="details">Email</span>
                                    <input type="email" name="email" value={contact.email} onChange={onChange} required />
                                </div>
                                <div className="input-box">
                                    <span className='details'>Title</span>
                                    <input type="text" name="title" value={contact.title} onChange={onChange} required />
                                </div>
                                <div className="input-box">
                                    <span className='details'>Phone Number</span>
                                    <input type="text" name="phone" value={contact.phone} onChange={onChange} required />
                                </div>
                                <div className="input-box">
                                    <span className='details'>Address</span>
                                    <input type="text" name="address" value={contact.address} onChange={onChange} required />
                                </div>
                                <div className="input-box">
                                    <span className='details'>Account Status</span>
                                    <input type="text" name="status" value={contact.status} onChange={onChange} required />
                                </div>
                                
                            </div>
                            <div className="form_footer">
                                <button type="submit" className="btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            <form style={{ display:'none' }}> 
                    <input type="file" name='photo' onChange={(event)=>updatePhoto(event.target.files[0])} ref={photoRef} required/>
            </form>
        </>
    )
}

export default ContactDetails;