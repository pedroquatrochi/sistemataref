document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const formulario = document.getElementById('formulario');
    const taskIdInput = document.getElementById('itaskid');
    const taskTitleInput = document.getElementById('ititle');
    const taskDescriptionInput = document.getElementById('idescription');
    const taskStatusSelect = document.getElementById('istatus');
    const taskDueDateInput = document.getElementById('iduedate');
    const salvarTarefaBtn = formulario.querySelector('.custom-button[type="submit"]');
    const cancelarEdicaoBtn = formulario.querySelector('.cancelar-edicao');
    const tabelaBody = document.getElementById('tabela').getElementsByTagName('tbody')[0];

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingTaskId = null; 

    const carregarTarefas = () => {
        atualizarTabela(tasks); 
    };

    formulario.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const status = taskStatusSelect.value;
        const due_date = taskDueDateInput.value.trim();

        if (!title) {
            alert('O título da tarefa é obrigatório!');
            return;
        }

        if (editingTaskId !== null) {
            const taskIndex = tasks.findIndex(task => task.id === editingTaskId);
            if (taskIndex > -1) {
                tasks[taskIndex] = {
                    id: editingTaskId,
                    title,
                    description,
                    status,
                    due_date
                };
                alert('Tarefa atualizada com sucesso!');
            }
        } else {
            const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1; // Gera um novo ID
            const newTask = {
                id: newId,
                title,
                description,
                status,
                due_date
            };
            tasks.push(newTask);
            alert('Tarefa adicionada com sucesso!');
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        limparFormulario();
        carregarTarefas();
    });

    const excluirTarefa = (id) => {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
            return;
        }

        tasks = tasks.filter(task => task.id !== id);
        
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        alert('Tarefa excluída com sucesso!');
        carregarTarefas(); 
    };

    const editarTarefa = (id) => {
        const taskToEdit = tasks.find(task => task.id === id);
        if (taskToEdit) {
            taskIdInput.value = taskToEdit.id;
            taskTitleInput.value = taskToEdit.title;
            taskDescriptionInput.value = taskToEdit.description;
            taskStatusSelect.value = taskToEdit.status;
            taskDueDateInput.value = taskToEdit.due_date;
            
            editingTaskId = taskToEdit.id; 
            salvarTarefaBtn.textContent = 'Atualizar Tarefa';
            cancelarEdicaoBtn.style.display = 'inline-block'; 
        }
    };

    const atualizarTabela = (currentTasks) => {
        tabelaBody.innerHTML = '';

        if (currentTasks.length === 0) {
            tabelaBody.innerHTML = '<tr><td colspan="6">Nenhuma tarefa cadastrada.</td></tr>';
            return;
        }

        currentTasks.forEach(task => {
            const linha = tabelaBody.insertRow();
            linha.insertCell(0).textContent = task.id;
            linha.insertCell(1).textContent = task.title;
            linha.insertCell(2).textContent = task.description || '-';
            linha.insertCell(3).textContent = task.status.replace(/_/g, ' ').toUpperCase();
            linha.insertCell(4).textContent = task.due_date || '-';

            const celulaAcoes = linha.insertCell(5);
            
            const editarBotao = document.createElement('button');
            editarBotao.textContent = 'Editar';
            editarBotao.className = 'edit-button';
            editarBotao.onclick = () => editarTarefa(task.id);
            celulaAcoes.appendChild(editarBotao);

            const deleteBotao = document.createElement('button');
            deleteBotao.textContent = 'Excluir';
            deleteBotao.className = 'delete-button';
            deleteBotao.onclick = () => excluirTarefa(task.id);
            celulaAcoes.appendChild(deleteBotao);
        });
    };

    const limparFormulario = () => {
        taskIdInput.value = '';
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
        taskStatusSelect.value = 'pending';
        taskDueDateInput.value = '';
        salvarTarefaBtn.textContent = 'Salvar Tarefa';
        cancelarEdicaoBtn.style.display = 'none';
        editingTaskId = null;
    };

    cancelarEdicaoBtn.addEventListener('click', limparFormulario);

    carregarTarefas();
});