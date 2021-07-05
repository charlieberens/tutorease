 import React, { Component, PropTypes } from 'react';
import axios from 'axios';

class AssignSet extends Component {
    constructor(props) {
		super(props);

		this.state = {
			students: [],
            error_message: undefined
		}
	}

    componentDidMount = () => {
        this.loadStudents();
    }

    loadStudents = () => {
        axios.get('/api/students/list-students').then(res => {
            this.setState({students: res.data.students})
        }).catch(err => {
            console.log(err)
        });
    }

    selectStudent = index => {
    	let tempStudents = this.state.students;
    	tempStudents[index].selected = !tempStudents[index].selected
    	this.setState({students: tempStudents});
    }

    assign = () => {
    	let students = this.state.students.filter(student => student.selected);
    	students = students.map(student => student._id);
        axios.post(`/api/students/assign/${students.join(',')}/${this.props.set_id}`).then(res => {
            this.props.popupMethod();
            this.props.loadMethod();
        }).catch(err => {
            this.setState({error_message: err.response?.data.err});
        });
    }

	render() {
		return (
			<div className="assign-student-list">
                <h2>Assign <em>{this.props.set_title}</em> to:</h2>
                <em>Once a set is assigned, it may can no longer be edited</em>
                <div className="err-cont">
                    <span className="err">{this.state.error_message}</span>
                </div>
                {this.state.students.map((student, index) => 
                    <div className={`student-list-item student-list-student assign-student-list-item ${student.selected && 'selected'}`} onClick={() => this.selectStudent(index)}>
                        <img className="student-list-item-left" src={student.profileIcon}/>
                        <div className="student-list-item-right">
                            <h3 className="student-list-student-displayName">{student.displayName}</h3>
                            <span className="student-list-student-username">@{student.username}</span>
                        </div>
                    </div>
                )}
                <button className="assign-button button-a" onClick={this.assign}>Assign</button>
			</div>
		);
	}
}

export default AssignSet;
