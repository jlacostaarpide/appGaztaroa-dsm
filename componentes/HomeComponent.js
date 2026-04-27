import { Component } from 'react';
import { ScrollView, View, ImageBackground, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import { baseUrl } from '../comun/comun';
import { IndicadorActividad } from './IndicadorActividadComponent';

const mapStateToProps = (state) => ({
  excursiones: state.excursiones,
  cabeceras: state.cabeceras,
  actividades: state.actividades,
});

function RenderItem(props) {
  if (props.isLoading) {
    return (
      <IndicadorActividad />
    );
  } else if (props.errMess) {
    return (
      <View>
        <Text>{props.errMess}</Text>
      </View>
    );
  } else {
    const item = props.item;
    if (item != null) {
      return (
        <Card style={styles.card}>
          <ImageBackground
            source={{ uri: baseUrl + item.imagen }}
            style={styles.image}
          >
            <Text style={styles.titulo}>{item.nombre}</Text>
          </ImageBackground>
          <Card.Content>
            <Text style={styles.descripcion}>
              {item.descripcion}
            </Text>
          </Card.Content>
        </Card>
      );
    } else {
      return (<View></View>);
    }
  }
}

class Home extends Component {
  render() {
    return (
      <ScrollView>
        <RenderItem
          item={this.props.cabeceras.cabeceras.filter((item) => item.destacado)[0]}
          isLoading={this.props.cabeceras.isLoading}
          errMess={this.props.cabeceras.errMess}
        />
        <RenderItem
          item={this.props.excursiones.excursiones.filter((excursion) => excursion.destacado)[0]}
          isLoading={this.props.excursiones.isLoading}
          errMess={this.props.excursiones.errMess}
        />
        <RenderItem
          item={this.props.actividades.actividades.filter((item) => item.destacado)[0]}
          isLoading={this.props.actividades.isLoading}
          errMess={this.props.actividades.errMess}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  image: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
  },
  descripcion: {
    marginTop: 20,
    marginBottom: 20,
  },
  titulo: {
    color: 'chocolate',
    fontSize: 34,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
});

export default connect(mapStateToProps)(Home);