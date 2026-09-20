import React, { createContext, useContext, useReducer, useState } from "react";

const TarefasContext = createContext();

const estadoInicial = {
  tarefas: [],
  filtro: "todas"
};

function tarefasReducer(state, action) {
  switch (action.type) {
    case "ADICIONAR_TAREFA":
      return {
        ...state,
        tarefas: [
          ...state.tarefas,
          {
            id: Date.now(),
            nome: action.payload,
            concluida: false
          }
        ]
      };

    case "ALTERAR_STATUS":
      return {
        ...state,
        tarefas: state.tarefas.map((tarefa) =>
          tarefa.id === action.payload
            ? { ...tarefa, concluida: !tarefa.concluida }
            : tarefa
        )
      };

    case "ALTERAR_FILTRO":
      return {
        ...state,
        filtro: action.payload
      };

    default:
      return state;
  }
}

function TarefasProvider({ children }) {
  const [state, dispatch] = useReducer(tarefasReducer, estadoInicial);

  return (
    <TarefasContext.Provider value={{ state, dispatch }}>
      {children}
    </TarefasContext.Provider>
  );
}

function Tarefa({ tarefa }) {
  const { dispatch } = useContext(TarefasContext);

  return (
    <li style={styles.item}>
      <label style={styles.label}>
        <input
          type="checkbox"
          checked={tarefa.concluida}
          onChange={() =>
            dispatch({
              type: "ALTERAR_STATUS",
              payload: tarefa.id
            })
          }
        />

        <span
          style={{
            marginLeft: 10,
            textDecoration: tarefa.concluida ? "line-through" : "none",
            opacity: tarefa.concluida ? 0.6 : 1
          }}
        >
          {tarefa.nome}
        </span>
      </label>
    </li>
  );
}

function ListaDeTarefas() {
  const { state } = useContext(TarefasContext);

  const tarefasFiltradas = state.tarefas.filter((tarefa) => {
    if (state.filtro === "concluidas") {
      return tarefa.concluida;
    }

    if (state.filtro === "pendentes") {
      return !tarefa.concluida;
    }

    return true;
  });

  if (tarefasFiltradas.length === 0) {
    return <p style={styles.vazio}>Nenhuma tarefa encontrada.</p>;
  }

  return (
    <ul style={styles.lista}>
      {tarefasFiltradas.map((tarefa) => (
        <Tarefa key={tarefa.id} tarefa={tarefa} />
      ))}
    </ul>
  );
}

function GerenciadorDeTarefas() {
  const { state, dispatch } = useContext(TarefasContext);
  const [novaTarefa, setNovaTarefa] = useState("");

  function adicionarTarefa() {
    const nome = novaTarefa.trim();

    if (!nome) {
      return;
    }

    dispatch({
      type: "ADICIONAR_TAREFA",
      payload: nome
    });

    setNovaTarefa("");
  }

  function tratarTecla(event) {
    if (event.key === "Enter") {
      adicionarTarefa();
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>Gerenciador de Tarefas</h1>

      <div style={styles.formulario}>
        <input
          type="text"
          placeholder="Digite uma tarefa"
          value={novaTarefa}
          onChange={(event) => setNovaTarefa(event.target.value)}
          onKeyDown={tratarTecla}
          style={styles.input}
        />

        <button onClick={adicionarTarefa} style={styles.botaoAdicionar}>
          Adicionar
        </button>
      </div>

      <div style={styles.filtros}>
        <button
          onClick={() =>
            dispatch({ type: "ALTERAR_FILTRO", payload: "todas" })
          }
          style={{
            ...styles.botaoFiltro,
            fontWeight: state.filtro === "todas" ? "bold" : "normal"
          }}
        >
          Todas
        </button>

        <button
          onClick={() =>
            dispatch({ type: "ALTERAR_FILTRO", payload: "concluidas" })
          }
          style={{
            ...styles.botaoFiltro,
            fontWeight: state.filtro === "concluidas" ? "bold" : "normal"
          }}
        >
          Concluídas
        </button>

        <button
          onClick={() =>
            dispatch({ type: "ALTERAR_FILTRO", payload: "pendentes" })
          }
          style={{
            ...styles.botaoFiltro,
            fontWeight: state.filtro === "pendentes" ? "bold" : "normal"
          }}
        >
          Pendentes
        </button>
      </div>

      <ListaDeTarefas />
    </div>
  );
}

export default function App() {
  return (
    <TarefasProvider>
      <GerenciadorDeTarefas />
    </TarefasProvider>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 600,
    margin: "40px auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box"
  },
  titulo: {
    textAlign: "center"
  },
  formulario: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16
  },
  botaoAdicionar: {
    padding: "10px 16px",
    cursor: "pointer"
  },
  filtros: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
    justifyContent: "center"
  },
  botaoFiltro: {
    padding: "8px 14px",
    cursor: "pointer"
  },
  lista: {
    listStyle: "none",
    padding: 0
  },
  item: {
    padding: 12,
    border: "1px solid #ddd",
    marginBottom: 8,
    borderRadius: 4
  },
  label: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer"
  },
  vazio: {
    textAlign: "center",
    color: "#666"
  }
};
