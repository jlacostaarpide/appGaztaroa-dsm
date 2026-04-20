import { Component } from 'react';
import { View, ImageBackground, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Divider, IconButton } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { baseUrl } from '../comun/comun';

const mapStateToProps = (state) => ({
  excursiones: state.excursiones,
  comentarios: state.comentarios,
});

function RenderExcursion(props) {
  const excursion = props.excursion;

  if (excursion != null) {
    return (
      <Card style={styles.card}>
        <ImageBackground
          source={{ uri: baseUrl + excursion.imagen }}
          style={styles.image}
        >
          <Text style={styles.titulo}>{excursion.nombre}</Text>
        </ImageBackground>
        <Card.Content>
          <Text style={styles.descripcion}>
            {excursion.descripcion}
          </Text>
        </Card.Content>
        <Divider />
        <View style={styles.iconoContainer}>
          <IconButton
            icon={props.favorita ? 'heart' : 'heart-outline'}
            size={28}
            onPress={() =>
              props.favorita
                ? console.log('La excursión ya se encuentra entre las favoritas')
                : props.onPress()
            }
          />
        </View>
      </Card>
    );
  } else {
    return <View />;
  }
}

function RenderComentario(props) {
  const comentarios = props.comentarios;

  const renderItem = ({ item }) => {
    const fecha = new Date(item.dia);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const horaFormateada = fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const estrellas = '★'.repeat(item.valoracion) + '☆'.repeat(5 - item.valoracion);

    return (
      <View style={styles.comentarioItem}>
        <Text style={styles.comentarioTexto}>{item.comentario}</Text>
        <Text style={styles.comentarioEstrellas}>{estrellas}</Text>
        <Text style={styles.comentarioAutor}>— {item.autor}</Text>
        <Text style={styles.comentarioFecha}>{fechaFormateada}, {horaFormateada}</Text>
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Title title="Comentarios" titleStyle={styles.comentariosTitulo} />
      <Card.Content>
        <FlatList
          data={comentarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separador} />}
          ListEmptyComponent={
            <Text style={styles.sinComentarios}>No hay comentarios para esta excursión.</Text>
          }
          scrollEnabled={false}
        />
      </Card.Content>
    </Card>
  );
}

class DetalleExcursion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favoritos: [],
    };
  }

  marcarFavorito(excursionId) {
    this.setState({ favoritos: this.state.favoritos.concat(excursionId) });
  }

  render() {
    const { excursionId } = this.props.route.params;

    return (
      <ScrollView>
        <RenderExcursion
          excursion={this.props.excursiones.excursiones[+excursionId]}
          favorita={this.state.favoritos.some(el => el === excursionId)}
          onPress={() => this.marcarFavorito(excursionId)}
        />
        <RenderComentario
          comentarios={this.props.comentarios.comentarios.filter(
            (comentario) => comentario.excursionId === +excursionId
          )}
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
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  iconoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  comentariosTitulo: {
    color: 'chocolate',
    fontWeight: 'bold',
  },
  comentarioItem: {
    paddingVertical: 10,
  },
  comentarioTexto: {
    fontSize: 14,
    marginBottom: 6,
  },
  comentarioEstrellas: {
    fontSize: 18,
    color: 'goldenrod',
    marginBottom: 4,
  },
  comentarioAutor: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'chocolate',
    marginBottom: 2,
  },
  comentarioFecha: {
    fontSize: 12,
    color: 'gray',
  },
  separador: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  sinComentarios: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 10,
  },
});

export default connect(mapStateToProps)(DetalleExcursion);
