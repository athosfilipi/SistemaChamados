import './customers.css'
import Title from '../../components/Title'
import Header from '../../components/Header'
import { FiUser } from 'react-icons/fi'
import { useState } from 'react'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

export default function Customers() {
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCNPJ] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(e) {
        e.preventDefault();

        if (nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
            //cria a collection customers e adiciona os dados
            await firebase.firestore().collection('customers')
                .add({
                    nomeFantasia: nomeFantasia,
                    cnpj: cnpj,
                    endereco: endereco
                })
                .then(() => { //deu certo
                    setNomeFantasia('');
                    setCNPJ('');
                    setEndereco('');
                    toast.success("Empresa cadastrada com sucesso!")
                }).catch((error) => {  //deu erro
                    console.log("Erro ao cadastrar empresa::::", error)
                    toast.error("Erro ao cadastrar empresa!")
                })
        } else {
            toast.error("Preencha todos os campos!");
        }
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Clientes">
                    <FiUser size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile customers' onSubmit={handleAdd}>
                        <label>Nome fantasia</label>
                        <input type="text" placeholder="Nome da sua empresa" value={nomeFantasia} onChange={(e) => setNomeFantasia(e.target.value)} />

                        <label>CNPJ</label>
                        <input type="text" placeholder="Seu CNPJ" value={cnpj} onChange={(e) => setCNPJ(e.target.value)} />

                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}