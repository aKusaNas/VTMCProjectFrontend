import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios';


export default class NewTask extends Component {


    state = {
        nameInput: '',
        descriptionInput: '',
        managerInput: '',
        dateInput: ''
    }

    handleUpdate = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({
            [name]: value
        }, () => console.log(this.state));
    }

    validateFields() {
        const { nameInput, descriptionInput, managerInput, dateInput} = { ...this.state };
        const nameValid = (nameInput.length < 100 && nameInput !== '');
        const descriptionValid = (descriptionInput.length < 300 && descriptionInput !== '');
        const managerValid = (managerInput.length < 60 && managerInput !== '');
        const dateValid = (dateInput !== '' && Date.parse(dateInput) >= Date.now()); 

        return nameValid && descriptionValid && managerValid && dateValid;
    }

    // TODO: Show error messages next to fields if they fail to validate

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateFields()) {
            
            let payload = {
                "projectName": this.state.nameInput,
                "projectDescription": this.state.descriptionInput,
                "projectManager": this.state.managerInput,
                "projectDeadline": this.state.dateInput,
                "projectStatus": "Not started"
            }

            Axios.post(`http://localhost:8080/projects/`, payload);
            // NEED TO REFRESH PROJECT STATE AFTER AN UPDATE. Probably should do that after submitting on the next page.
        } else {
            alert("There are errors in your form, please try again.")
        }
    }



    render() {
        return (

            <form className="container col-7">
                <div className="form-group row">
                    <label className="col-2 col-form-label">Project Name</label>
                    <div className="col-10">
                        <input type="name" className="form-control" id="inputName" name="nameInput" onChange={(event) => this.handleUpdate(event)} />
                    </div>
                </div>

                <div className="form row">
                    <label className="col-2 col-form-label" >Description</label>
                    <div className="col-10">
                        <textarea className="form-control" style={{ resize: "none" }} name="descriptionInput" id="inputdescription" rows="5" onChange={(event) => this.handleUpdate(event)} ></textarea>
                    </div>
                </div>
                <br />

                <div className="form-group row">
                    <label className="col-2 col-form-label">Project Manager</label>
                    <div className="col-10">
                        <input type="projectmanager" className="form-control" id="inputProjectmanager" name="managerInput" onChange={(event) => this.handleUpdate(event)} />
                    </div>
                </div>

                <div className="form-group row">
                    <label className="col-2 col-form-label">Deadline</label>
                    <div className="col-10">
                        <input type="date" className="form-control" id="deadline" name="dateInput" onChange={(event) => this.handleUpdate(event)} />
                        
                    </div>
                </div>


                <div className="form-group row text-right mb-3">
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary" onClick={(event) => this.handleSubmit(event)}>Save</button>
                        <Link to="/projects"> <div className="btn btn-info" role="button">Close</div> </Link>
                        {/* TODO: add confirmation dialog when closing. */}
                        {/* TODO: send user to the project overview page when the correct data is submitted.*/}
                    </div>

                </div>

            </form>
        )
    }
}
