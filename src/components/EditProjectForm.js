import { Link, useHistory, useParams } from 'react-router-dom';
import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProject } from '../actions/projects'


function EditProjectForm() {

    let dispatch = useDispatch();
    let history = useHistory();
    let params = useParams();
    const project = useSelector(state => state.projects.find(({ projectId }) => projectId === parseInt(params.id)));

    const [state, setState] = useState({
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        projectManager: project.projectManager || "Add a manager",
        projectDeadline: new Date(project.projectDeadline).toLocaleDateString('lt-LT') || new Date(Date.now()).toLocaleDateString('lt-LT')
    });

    const handleUpdate = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        console.log(history)
        setState({
            ...state,
            [name]: value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validateFields()) {
            let payload = {
                ...state,
            };

            Axios.patch(`http://localhost:8080/projects/${params.id}`, payload).then(response => {
                if (response.status === 200) {
                    Axios.get(`http://localhost:8080/projects/${params.id}`).then(res => {
                        const data = res.data;
                        dispatch(updateProject(parseInt(params.id), data));
                        history.goBack();
                    });
                }
            });

        } else {
            alert("There are errors in your form, please try again.");
        }

    }

    function validateFields() {
        const { projectName, projectDescription, projectManager, projectDeadline } = { ...state };
        const nameValid = (projectName.length < 100 && projectName.trim() !== '');
        const descriptionValid = (projectDescription.length < 300 && projectDescription.trim() !== '');
        const managerValid = (projectManager.length < 60 && projectManager.trim() !== '');
        const dateValid = (projectDeadline !== '' && Date.parse(projectDeadline) >= Date.now());

        return nameValid && descriptionValid && managerValid && dateValid;
    }

    // For debugging
    useEffect(() => {
        console.log(state);
        console.log(validateFields());
    })


    return (

        <form className="container col-7">
            <div className="form-group row">
                <label className="col-2 col-form-label">Project Name</label>
                <div className="col-10">
                    <input type="name" className="form-control" id="inputName" name="projectName" value={state.projectName} onChange={handleUpdate} />
                </div>
            </div>

            <div className="form row">
                <label className="col-2 col-form-label" >Description</label>
                <div className="col-10">
                    <textarea className="form-control" style={{ resize: "none" }} value={state.projectDescription} name="projectDescription" id="inputdescription" rows="5" onChange={handleUpdate} ></textarea>
                </div>
            </div>
            <br />

            <div className="form-group row">
                <label className="col-2 col-form-label">Project Manager</label>
                <div className="col-10">
                    <input type="projectmanager" className="form-control" value={state.projectManager} id="inputProjectmanager" name="projectManager" onChange={handleUpdate} />
                </div>
            </div>

            <div className="form-group row">
                <label className="col-2 col-form-label">Deadline</label>
                <div className="col-10">
                    <input type="date" className="form-control" id="deadline" value={state.projectDeadline} name="projectDeadline" onChange={handleUpdate} />

                </div>
            </div>


            <div className="form-group row text-right mb-3">
                <div className="col-12">
                    <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Save</button>
                    <Link to={`/projects/${params.id}`}> <div className="btn btn-info" role="button">Close</div> </Link>
                </div>

            </div>

        </form>
    )
}

export default EditProjectForm;