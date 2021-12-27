import React, {Component, useState} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import Table from 'react-bootstrap/Table';
import {Button} from "react-bootstrap";
import "regenerator-runtime/runtime";


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            List: [],
            MasterChecked: false,
            SelectedList: [],
        };
    }

    // Select/ UnSelect Table rows
    onMasterCheck(e) {
        let tempList = this.state.List;
        // Check/ UnCheck All Items
        tempList.map((user) => (user.selected = e.target.checked));

        //Update State
        this.setState({
            MasterChecked: e.target.checked,
            List: tempList,
            SelectedList: this.state.List.filter((e) => e.selected),
        });
    }

    // Update List Item's state and Master Checkbox State
    onItemCheck(e, item) {
        let tempList = this.state.List;
        tempList.map((user) => {
            if (user.id === item.id) {
                user.selected = e.target.checked;
            }
            return user;
        });

        // Update State
        this.setState({
            MasterChecked: totalItems === totalCheckedItems,
            List: tempList,
            SelectedList: this.state.List.filter((e) => e.selected),
        });
    }

    // Event to get selected rows(Optional)
    getSelectedRows() {
        this.setState({
            SelectedList: this.state.List.filter((e) => e.selected),
        });
    }

    componentDidMount() {
        this.props.getUsers();
    }

    handleDeleteUsers(id) {
        return () => this.props.deleteUser(id);
    }

    render() {
        const { user, users } = this.props;
        this.state.List=users.items;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h3>All registered users:</h3>
                <Button as="input" type="button" value="Delete" onClick={this.handleDeleteUsers(2)} />{'  '}
                <Button as="input" type="button" value="Block" />{'  '}
                <Button as="input" type="button" value="Unblock" />
                {users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={this.state.MasterChecked}
                                id="mastercheck"
                                onChange={(e) => this.onMasterCheck(e)}
                            />
                        </th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Date of registration</th>
                        <th>Date of last login</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    {users.items &&
                        <tbody>
                        {users.items.map(user =>(
                            <tr key={user.id} >
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={user.selected}
                                        className="form-check-input"
                                        id="rowcheck{user.id}"
                                        onChange={(e) => this.onItemCheck(e, user)}
                                    />
                                </th>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.dateOfRegistration}</td>
                                <td>{user.dateOfLastLogin}</td>
                                <td>{user.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    }
                </Table>
                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);

export { connectedHomePage as HomePage };

