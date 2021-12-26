import React, {Component, useState} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import Table from 'react-bootstrap/Table'

class HomePage extends React.Component {
    componentDidMount() {
        this.props.getUsers();
    }

    handleDeleteUser(id) {
        return (e) => this.props.deleteUser(id);
    }

    render() {
        const { user, users } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h3>All registered users:</h3>
                {users.loading && <em>Loading users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={false}
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
                            <tr key={user.id}>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={false}
                                    />
                                </th>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>

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

