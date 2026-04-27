import { Component } from 'react';
import { View, ImageBackground, StyleSheet, FlatList, Modal } from 'react-native';
import { Card, Text, Divider, IconButton, TextInput, Button } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { baseUrl } from '../comun/comun';
import { postFavorito, postComentario } from '../redux/ActionCreators';

const mapStateToProps = (state) => ({
  excursiones: state.excursiones,
  comentarios: state.comentarios,
  favoritos: state.favoritos,
});

const mapDispatchToProps = dispatch => ({
  postFavorito: (excursionId) => dispatch(postFavorito(excursionId)),
  postComentario: (excursionId, valoracion, autor, comentario) => dispatch(postComentario(excursionId, valoracion, autor, comentario))
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
          <IconButton
            icon="pencil"
            size={28}
            onPress={props.onShowModal}
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
      showModal: false,
      valoracion: 5,
      autor: '',
      comentario: '',
    };
  }

  marcarFavorito(excursionId) {
    this.props.postFavorito(excursionId);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  resetForm() {
    this.setState({
      valoracion: 3,
      autor: '',
      comentario: '',
      showModal: false,
    });
  }

  gestionarComentario(excursionId) {
    this.props.postComentario(excursionId, this.state.valoracion, this.state.autor, this.state.comentario);
    this.resetForm();
  }

  render() {
    const { excursionId } = this.props.route.params;
    const etiquetasValoracion = ['', 'Pésimo', 'Malo', 'Normal', 'Bueno', 'Excelente'];

    return (
      <ScrollView>
        <RenderExcursion
          excursion={this.props.excursiones.excursiones[+excursionId]}
          favorita={this.props.favoritos.favoritos.some(el => el === excursionId)}
          onPress={() => this.marcarFavorito(excursionId)}
          onShowModal={() => this.toggleModal()}
        />
        <RenderComentario
          comentarios={this.props.comentarios.comentarios.filter(
            (comentario) => comentario.excursionId === +excursionId
          )}
        />
        <Modal
          visible={this.state.showModal}
          onRequestClose={() => this.resetForm()}
          animationType="slide"
        >
          <ScrollView>
            <View style={styles.modal}>
              <Text style={styles.modalTitulo}>Añadir comentario</Text>
              <View style={styles.estrellas}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconButton
                    key={i}
                    icon={i <= this.state.valoracion ? 'star' : 'star-outline'}
                    size={36}
                    iconColor="goldenrod"
                    onPress={() => this.setState({ valoracion: i })}
                  />
                ))}
              </View>
              <Text style={styles.etiquetaValoracion}>
                {etiquetasValoracion[this.state.valoracion]}
              </Text>
              <TextInput
                mode="outlined"
                placeholder="Autor"
                value={this.state.autor}
                onChangeText={(text) => this.setState({ autor: text })}
                left={<TextInput.Icon icon="account" />}
                style={styles.textInput}
              />
              <TextInput
                mode="outlined"
                placeholder="Comentario"
                value={this.state.comentario}
                onChangeText={(text) => this.setState({ comentario: text })}
                left={<TextInput.Icon icon="comment-text" />}
                style={styles.textInput}
              />
              <View style={styles.botonesFormulario}>
                <Button
                  mode="outlined"
                  icon="close"
                  onPress={() => this.resetForm()}
                >Cancelar</Button>
                <Button
                  mode="contained"
                  icon="chevron-right"
                  buttonColor="#007AFF"
                  onPress={() => this.gestionarComentario(excursionId)}
                >Enviar</Button>
              </View>
            </View>
          </ScrollView>
        </Modal>
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modal: {
    margin: 24,
    marginTop: 60,
  },
  modalTitulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  estrellas: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  etiquetaValoracion: {
    textAlign: 'center',
    alignSelf: 'stretch',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 24,
  },
  textInput: {
    marginBottom: 16,
  },
  botonesFormulario: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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

export default connect(mapStateToProps, mapDispatchToProps)(DetalleExcursion);
