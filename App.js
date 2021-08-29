import React from 'react';
import { StyleSheet, View, Button,Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5';
import Header from './components/Header';
import Card from './components/Card';
import helpers from './helpers';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this);
    this.resetCards = this.resetCards.bind(this);
   
    let sources = {
      'fontawesome': FontAwesome,
      'entypo': Entypo,
      'ionicons': Ionicons,
      'FontAwesome5Brands' : FontAwesome5Brands,
    };

    let cards = [
      {
        src: 'fontawesome',
        name: 'font',
        color: 'black'
      },
      {
        src: 'fontawesome',
        name: 'bold',
        color: 'black'
      },
      {
        src: 'fontawesome',
        name: 'copyright',
        color: 'black'
      },
      {
        src: 'FontAwesome5Brands',
        name: 'dochub',
        color: 'black'
      },
      {
        src: 'fontawesome',
        name: 'euro',
        color: 'black'
      },
      {
        src: 'fontawesome',
        name: 'facebook',
        color: 'black'
      },
      {
        src: 'fontawesome',
        name: 'google',
        color: 'black'
      },
      {
        src: 'fontawesome',
        name: 'header',
        color: 'black'
      }
    ];

    let clone = JSON.parse(JSON.stringify(cards));

    this.cards = cards.concat(clone);
    this.cards.map((obj) => {
      let id = Math.random().toString(36).substring(7);
      obj.id = id;
      obj.src = sources[obj.src];
      obj.is_open = false;
    });

    this.cards = this.cards.shuffle(); 
    this.state = {
      current_selection: [],
      selected_pairs: [],
      score: 0,
      cards: this.cards,
      totalAttempt: 0
    }
  
  }

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.body}>
          { 
            this.renderRows.call(this) 
          }
        </View>

        <Text style={styles.totalAttempts}>(Number of Attempts - {this.state.totalAttempt})</Text>
				<Text style={styles.score}>(matches completed - {this.state.score})</Text>
			  
        <Button
          onPress={this.resetCards}
          title="Reset"
          color="#008CFA" 
        />
      </View>
    );
  }
  

  resetCards() {
    let cards = this.cards.map((obj) => {
      obj.is_open = false;
      return obj;
    });

    cards = cards.shuffle();

    this.setState({
      current_selection: [],
      selected_pairs: [],
      cards: cards,
      score: 0,
      totalAttempt: 0,
    });
  }


  renderRows() {
   
    let contents = this.getRowContents(this.state.cards);
    return contents.map((cards, index) => {
      return (
        <View key={index} style={styles.row}>
          { this.renderCards(cards) }
        </View>
      );
    });
   
  }


  renderCards(cards) {
    return cards.map((card, index) => {
      return (
        <Card 
          key={index} 
          src={card.src} 
          name={card.name} 
          color={card.color} 
          is_open={card.is_open}
          clickCard={this.clickCard.bind(this, card.id)} 
        />
      );
    });
  }


  clickCard(id) {
    let selected_pairs = this.state.selected_pairs;
    let current_selection = this.state.current_selection;
    let score = this.state.score;
    let totalAttempt = this.state.totalAttempt;

    let index = this.state.cards.findIndex((card) => {
      return card.id == id;
    });

    let cards = this.state.cards;
    
    if(cards[index].is_open == false && selected_pairs.indexOf(cards[index].name) === -1){

      cards[index].is_open = true;
      
      current_selection.push({ 
        index: index,
        name: cards[index].name
      });

      if(current_selection.length == 2){
        if(current_selection[0].name == current_selection[1].name){
          score += 1;
          selected_pairs.push(cards[index].name);
        }else{
          cards[current_selection[0].index].is_open = false;

          setTimeout(() => {
            cards[index].is_open = false;
            this.setState({
              cards: cards
            });
          }, 500);
        }
        totalAttempt += 1;
        current_selection = [];
      }

      this.setState({
        score: score,
        cards: cards,
        current_selection: current_selection,
        totalAttempt: totalAttempt
      });

    }
  
  }


  getRowContents(cards) {
    let contents_r = [];
    let contents = [];
    let count = 0;
    cards.forEach((item) => {
      count += 1;
      contents.push(item);
      if(count == 4){
        contents_r.push(contents)
        count = 0;
        contents = [];
      }
    });

    return contents_r;
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff'
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  body: {
    flex: 18,
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 20
  },
  score: {
		fontSize: 14,
		fontWeight: 'bold',
		color:'green'
	},
  totalAttempts: {
		fontSize: 14,
		fontWeight: 'bold',
		color:'orange'
	}
});
