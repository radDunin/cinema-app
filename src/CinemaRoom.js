import React, { Component } from 'react';
import './dominikStyles.css';
import Screen from './Screen.js';
import RowsContainer from './RowsContainer.js';
import Legend from './Legend.js';
import {app} from './firebase.js';

class CinemaRoom extends Component {
	constructor(props) {
		super(props);
		let seats = [];
		let bgColors = [];
		for(let i = 0; i < 100; i++)
		{
			seats.push(true);
		}
		for(let i = 0; i < 100; i++)
		{
				bgColors.push('#3355FF');
		}

		this.state = {
			seats: seats,
			bgColors: bgColors,
			chosenSeats: [],
			canReserve: false};
		
		
		this.handleStateChange = this.handleStateChange.bind(this);
		this.handleOnMouseOverFreePlace = this.handleOnMouseOverFreePlace.bind(this);
		this.handleOnMouseOutFreePlace = this.handleOnMouseOutFreePlace.bind(this);
	}
	
	componentDidMount(){
		console.log(this.state.chosenSeats);
		let seats = [];
		let bgColors = [];
		let context = this;
		//Przy routingu trzeba tu podmienić wartość "-LCVoTIHGKwx9-gUvy7Z" na wartość dla kliknietego filmu		
		let movieID = this.props.id;
		const ref = app.database().ref().child("seances").child(movieID);
		
		ref.on('value', function(snapshot){
			seats = snapshot.val().sits;
			context.setState(function(prevState) {
				for(let i = 0; i < 100; i++)
				{
					if(seats[i] === true)
						bgColors.push('#3355FF');
					else
						bgColors.push('red');
				}
				return {
					seats: seats,
					bgColors: bgColors,
					canReserve: true};
			});
		}, function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
	
	}

	myFunction()
	{
		/*console.log("bla");
		let movieID = this.props.id;
			const ref = app.database().ref().child("seances").child(movieID);
			
			for(let i = 0; i < 100; i++)
			{
				ref.child("sits").child(i).set(true);
			}*/
	}
	
	reservation(number, value){
			let movieID = this.props.id;
			const ref = app.database().ref().child("seances").child(movieID);
			ref.child("sits").child(number).set(value);
	}

	handleStateChange(row, col) {
		if(this.state.canReserve)
		{
			if(this.state.seats[row*10+col])
			{
			  //console.log(this.state.chosenSeats);
				if(this.state.chosenSeats.length === 10)
				{
					console.log('You can not choose more than 10 seats');
				}
				else
				{ 
					this.setState(function(prevState) {
						let copySeats = prevState.seats;
						let copyBgColors = prevState.bgColors;
						let copyChosenSeats = prevState.chosenSeats;
					
						copySeats[row*10+col] = false;
						copyBgColors[row*10+col] = 'green';
						copyChosenSeats.push({row: row, seat: col});
						this.reservation(row*10+col,false);

						return {
							seats: copySeats,
							bgColors: copyBgColors,
							chosenSeats: copyChosenSeats,
						};
					});
				}
			}
			else
			{		
				let copyChosenSeats = this.state.chosenSeats;
				let searchRow = row;
				let searchSeat = col;
				let ind = -1;
				for(let i = 0; i < copyChosenSeats.length; i++) {
					if (copyChosenSeats[i].row === searchRow && copyChosenSeats[i].seat === searchSeat) {
						ind = i;
						break;
					}
				}
			  
				if(ind !== -1)
				{
					copyChosenSeats.splice(ind,1);

					this.setState(function(prevState) {
						let copySeats = prevState.seats;
						let copyBgColors = prevState.bgColors;
					//let copyChosenSeats = prevState.chosenSeats;
				
						copySeats[row*10+col] = true;
						copyBgColors[row*10+col] = '#3355FF';
						this.reservation(row*10+col,true);
						return {
							seats: copySeats,
							bgColors: copyBgColors,
							chosenSeats: copyChosenSeats,
						};
					});

				}
			}
		}
	}
	  
	handleOnMouseOverFreePlace(row, col) {
		if(this.state.seats[row*10+col])
		{
			this.setState(function(prevState) {
				let copy = prevState.bgColors;
				copy[row*10+col] = 'blue';
				return {
					bgColors: copy
				};
			});
		}
	}
	  
	handleOnMouseOutFreePlace(row, col) {
		if(this.state.seats[row*10+col])
		{
			this.setState(function(prevState) {
				let copy = prevState.bgColors;
				copy[row*10+col] = '#3355FF';
				return {
					bgColors: copy
				};
			});
		}
	}
		
	render() {
		let colors = [];
		for(let i = 0; i < 100; i++)
		{
			colors[i] = this.state.bgColors[i];
		}
		
		return (
			<div>
				<Screen/>
				<RowsContainer bgColors={colors} onStateChange={this.handleStateChange} onMouseOverFreePlace={this.handleOnMouseOverFreePlace} onMouseOutFreePlace={this.handleOnMouseOutFreePlace}/>
				<Legend/>
				<button onClick={this.myFunction}>Useless button</button> 
			</div>
		);
	}
}

export default CinemaRoom;