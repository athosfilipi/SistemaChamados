import { useState, useContext } from 'react'
import firebase from '../../services/firebaseConnection'
import './profile.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import { toast } from 'react-toastify'

import { AuthContext } from '../../contexts/auth'

export default function Profile() {

    const { user, signOut, setUser, storageUser } = useContext(AuthContext);
    //se tiver uma das propriedades setadas, vai atribuiir
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            } else {
                toast.error("Envie uma imagem do tipo PNG ou JPEG");
                setImageAvatar(null);
                return null;
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;

        const uploadTask = await firebase.storage()
            .ref(`images/${currentUid}/${imageAvatar.name}`)
            .put(imageAvatar)
            .then(async () => {
                toast.success('Foto enviada com sucesso!')

                await firebase.storage().ref(`images/${currentUid}`).child(imageAvatar.name)
                    .getDownloadURL()  
                    .then(async (url) => {
                        let urlFoto = url; //pega a URL da imagem

                        await firebase.firestore().collection('users')
                            .doc(user.uid)
                            .update({
                                avatarUrl: urlFoto,
                                nome: nome
                            })
                            .then(() => {
                                let data = {
                                    ...user,
                                    avatarUrl: urlFoto,
                                    nome: nome
                                };
                                setUser(data);
                                storageUser(data);
                            })
                    })
            })
    }

    async function handleSave(e) {
        e.preventDefault();  //não atualiza a página

        if (imageAvatar === null && nome !== '') {
            await firebase.firestore().collection('users').doc(user.uid).update({
                nome: nome  //salva e altera somente o nome, se alterar o input de nome
            }).then(() => {
                let data = {
                    ...user,
                    nome: nome
                };
                setUser(data);
                storageUser(data);
            })
        }
        else if (nome !== '' && imageAvatar !== null) {
            handleUpload();
        }
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className='form-profile' onSubmit={handleSave}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25} />
                            </span>
                            <input type="file" accept="image/*" onChange={handleFile} />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250
                           " alt="Foto de perfil" />
                                :
                                <img src={avatarUrl} width="250" height="250
                           " alt="Foto de perfil" />}
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>E-mail</label>
                        <input type="text" value={email} />

                        <button type="submit">
                            Salvar
                        </button>
                    </form>
                </div>
                <div className='container'>
                    <button
                        onClick={(() => signOut())}
                        className='logout-btn'>Sair</button>
                </div>
            </div>
        </div>
    )
}