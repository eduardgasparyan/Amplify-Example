import React from 'react'
import '../style/style.css'
import {Navigate} from "react-router-dom";
import {Auth} from "aws-amplify";
import {createItem, deleteItem, queryItems} from "../modules/dynamoDB";
import {v4 as uuidv4} from "uuid";
import getSuccessResponse from "../utils/getSuccessResponse";
const carsTableName = 'amplify-cars-table';

export default class userHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userCheck: false,
            logout: false,
            userCars: [],
            userInfo: {},
        }
    }
    getUser = async () => {
        const user = await Auth.currentAuthenticatedUser();
        console.log(user);
        this.setState({ userInfo: user});
        await this.getCars(this.state.userInfo);
        return user;
    }
    getCars = async (user) => {
        let params = {
            TableName: carsTableName,
            KeyConditionExpression: 'userId = :id',
            ExpressionAttributeValues: {
                ":id": user.attributes.sub
            },
        };
        console.log(params);
        const cars = await queryItems(params);
        console.log(cars);
        let carsName = [];
        cars.Items.forEach(x => carsName.push(x.carName + ' '))
        this.setState({ userCars: carsName })
    }
    userAddCar = async () => {
        console.log(this.state.userInfo);
        const carData = {
            userId: this.state.userInfo.attributes.sub,
            carId: uuidv4(),
            carName: document.getElementById('CarName').value, }
        try {
            console.log(carData);
            const result =  await createItem({
                TableName: carsTableName,
                Item: {...carData},
            });
            console.log(result);
            await this.getCars(this.state.userInfo);
            return getSuccessResponse(result,200);
        } catch (e) {
            console.log(e);
        }
    }
    userDeleteCar = async () => {
        let carId = '';
        const deleteCarName = document.getElementById('CarName').value
        let params = {
            TableName: carsTableName,
            KeyConditionExpression: 'userId = :id',
            ExpressionAttributeValues: {
                ":id": this.state.userInfo.attributes.sub
            },
        };
        try {
            const cars = await queryItems(params);
            console.log(cars);
            cars.Items.map((element) => {
                if (element.carName === deleteCarName) {
                    carId = element.carId;
                } else console.log(element.carName + deleteCarName);
            });
            if(carId === '') alert('Car not found');
            else {
                await deleteItem({
                    TableName: carsTableName,
                    Key: { userId: this.state.userInfo.attributes.sub , carId: carId, },
                });
                await this.getCars(this.state.userInfo);
            }
        } catch (e) {
            console.log(e);
        }
    }

    logoutButton = async () => {
        await Auth.signOut();
        this.setState({ logout: true, userCars: ''});
    }

    renderNormal = () => {
        if(!this.state.userCheck) { this.getUser().then(value => console.log(value)); this.setState({ userCheck: true }) };
        return (
            <div>
                <div>
                    <h3>Hi { this.state.userInfo.username }</h3>
                    <input type='button' value='Logout' onClick={this.logoutButton}/>
                    <div>
                        Your cars are {this.state.userCars}
                    </div>
                </div>
                <div>
                    <input type='text' placeholder='Car Name' id='CarName'/>
                    <input type='button' value='Add Car' onClick={this.userAddCar} />
                    <input type='button' value='Delete Car' onClick={this.userDeleteCar} />
                </div>
            </div>
        )
    }
    render = () => {
        if(!this.state.logout) return this.renderNormal();
        else return <Navigate to="/" replace={true}/> ;
    }

}