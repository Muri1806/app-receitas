// Importando hooks e bibliotecas necessárias
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage' // usado para salvar dados localmente
import {
   StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity,
   ScrollView,
   SafeAreaView,
} from 'react-native';

// Componente principal do app
export default function App() {
   // Estado que controla se a tela mostra a lista ou o formulário
   const [view, setView] = useState('lista');

   // Estado que guarda todas as receitas (array de objetos)
   const [recipes, setRecipes] = useState([]);
   const [title, setTitle] = useState('');
   const [ingredients, setIngredients] = useState('');

   useEffect(() => {
      const loadRecipes = async () => {
         try {
            // Pega o que está armazenado em '@recipes'
            const storedRecipes = await AsyncStorage.getItem('@recipes');
            if (storedRecipes !== null) {
               // Converte de string para objeto/array e salva no estado
               setRecipes(JSON.parse(storedRecipes));
            }
         } catch (e) {
            console.error("Falha ao carregar receitas.", e);
         }
      };
      loadRecipes();
   }, []);

   // Função para adicionar uma nova receita
   const handleAddRecipe = () => {
      // Se não houver título, não faz nada
      if (!title) {
         return;
      }
      // Cria um novo objeto de receita
      const newRecipe = {
         id: Date.now().toString(), // ID único baseado no timestamp
         title: title,
         ingredients: ingredients,
      };
      // Atualiza a lista adicionando a nova receita
      setRecipes(currentRecipes => [...currentRecipes, newRecipe]);

      // Limpa os inputs
      setTitle('');
      setIngredients('');

      // Volta para a lista após salvar
      setView('lista');
   }

   // Função para deletar uma receita (filtra e remove pelo ID)
   const handleDeleteRecipe = (id) => {
      setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe.id !== id));
   };

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Título do app */}
            <Text style={styles.header}>Meu Livro de Receitas</Text>

            {/* Renderização condicional: 
                se view === 'lista' mostra a lista, 
                senão mostra o formulário */}
            {view === 'lista' ? (
               <View>
                  {/* Botão para trocar para o formulário */}
                  <TouchableOpacity style={styles.addButton} onPress={() => setView('formulario')}>
                     <Text style={styles.buttonText}>Adicionar Nova Receita</Text>
                  </TouchableOpacity>

                  {/* Se não houver receitas, mostra mensagem */}
                  {recipes.length === 0 ? (
                     <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
                  ) : (
                     // Caso haja receitas, percorre o array e cria um "card" para cada uma
                     recipes.map((item) => (
                        <View key={item.id} style={styles.recipeItem}>
                           {/* Mostra título e ingredientes */}
                           <View style={styles.recipeTextContainer}>
                              <Text style={styles.recipeTitle}>{item.title}</Text>
                              <Text style={styles.recipeIngredients}>{item.ingredients}</Text>
                           </View>

                           {/* Botão para excluir a receita */}
                           <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => handleDeleteRecipe(item.id)}>
                              <Text style={styles.buttonText}>Excluir</Text>
                           </TouchableOpacity>
                        </View>
                     ))
                  )}
               </View>
            ) : (
               // Tela de formulário
               <View style={styles.formContainer}>
                  <Text style={styles.formHeader}>Adicionar Receita</Text>

                  {/* Input para título */}
                  <TextInput
                     style={styles.input}
                     placeholder="Título da Receita"
                     value={title}
                     onChangeText={setTitle}
                  />

                  {/* Input para ingredientes (multilinha) */}
                  <TextInput
                     style={[styles.input, styles.textArea]}
                     placeholder="Ingredientes"
                     value={ingredients}
                     onChangeText={setIngredients}
                     multiline={true}
                  />

                  {/* Botões de cancelar e salvar */}
                  <View style={styles.formActions}>
                     <TouchableOpacity
                        style={[styles.formButton, styles.cancelButton]}
                        onPress={() => setView('lista')}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        style={[styles.formButton, styles.saveButton]}
                        onPress={handleAddRecipe}>
                        <Text style={styles.buttonText}>Salvar</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            )}
         </ScrollView>
      </SafeAreaView>
   );
}

// Estilização da aplicação
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
   },
   scrollContainer: {
      padding: 16,
   },
   header: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 20,
      color: '#e67e22',
   },
   // Estilos do formulário
   formContainer: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
   },
   formHeader: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
   },
   input: {
      borderColor: '#bdc3c7',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 15,
      fontSize: 16,
   },
   textArea: {
      height: 100,
      textAlignVertical: 'top',
   },
   formActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
   },
   formButton: {
      flex: 1,
      padding: 12,
      borderRadius: 5,
      marginHorizontal: 5,
   },
   cancelButton: {
      backgroundColor: '#95a5a6',
   },
   saveButton: {
      backgroundColor: '#27ae60',
   },
   // Estilos da lista
   addButton: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 20,
   },
   recipeItem: {
      backgroundColor: '#fff',
      padding: 20,
      marginVertical: 8,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   recipeTextContainer: {
      flex: 1,
      marginRight: 15,
   },
   recipeTitle: {
      fontSize: 20,
      fontWeight: 'bold',
   },
   recipeIngredients: {
      fontSize: 16,
      color: '#7f8c8d',
      marginTop: 5,
   },
   deleteButton: {
      backgroundColor: '#e74c3c',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
   },
   buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
   },
   emptyText: {
      textAlign: 'center',
      marginTop: 30,
      fontSize: 18,
      color: '#95a5a6',
   },
});
