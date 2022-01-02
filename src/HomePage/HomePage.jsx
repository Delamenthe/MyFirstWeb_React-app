import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import Table from 'react-bootstrap/Table';
import {Button} from "react-bootstrap";


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

        //To Control Master Checkbox State
        const totalItems = this.state.List.length;
        const totalCheckedItems = tempList.filter((e) => e.selected).length;

        // Update State
        this.setState({
            MasterChecked: totalItems === totalCheckedItems,
            List: tempList,
            SelectedList: this.state.List.filter((e) => e.selected),
        });
    }

    componentDidMount() {
        this.props.getUsers();
    }

    deleteUsers(){
        let sList=this.state.SelectedList;
        for (let i =0; i<sList.length; i++){
            this.props.deleteUser(sList[i].id);
        }
        location.reload();
    }

    blockUsers(){
        const { user, users } = this.props;
        let sList=this.state.SelectedList;
        for (let i =0; i<sList.length; i++) {
            users.items[users.items.indexOf(sList[i])].status = "Blocked";
            this.props.update(sList[i].id, this.state.List[this.state.List.indexOf(sList[i])]);
        }
    }

    unblockUsers(){
        const { user, users } = this.props;
        let sList=this.state.SelectedList;
        for (let i =0; i<sList.length; i++){
            users.items[users.items.indexOf(sList[i])].status = "Active" ;
            this.props.update(sList[i].id,this.state.List[this.state.List.indexOf(sList[i])]);
        }
    }

    render() {
        const { user, users } = this.props;
        this.state.List=users.items;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h3>All registered users:</h3>
                <Button as="input" type="button" value="Delete" onClick={()=>this.deleteUsers()} />{'  '}
                <Button as="input" type="button" value="Block" onClick={()=>this.blockUsers()}/>{'  '}
                <Button as="input" type="button" value="Unblock" onClick={()=>this.unblockUsers()} />

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
                                <td >{user.status}</td>
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
    deleteUser: userActions.delete,
    update: userActions.update,
    logout: userActions.logout
}

const connectedHomePage = connect(mapState, actionCreators)(HomePage);

export { connectedHomePage as HomePage };

