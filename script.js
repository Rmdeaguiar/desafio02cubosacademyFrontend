const root = document.querySelector('body')
const input = document.querySelector('.input');
const divMovies = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const btnTema = document.querySelector('.btn-theme');
const movies = document.querySelector('.movies');
const hVideo = document.querySelector('.highlight__video');
const hTitle = document.querySelector('.highlight__title');
const hRating = document.querySelector('.highlight__rating');
const hGenres = document.querySelector('.highlight__genres');
const hLaunch = document.querySelector('.highlight__launch');
const hDescription = document.querySelector('.highlight__description');
const hVideoLink = document.querySelector('.highlight__video-link');
const modal = document.querySelector('.modal');
const mTitle = document.querySelector('.modal__title');
const mImagem = document.querySelector('.modal__img');
const mDescription = document.querySelector('.modal__description');
const mText = document.querySelector('.modal__average');
const mGenres = document.querySelector('.modal__genres');
const closeModal = document.querySelector('.modal__close');
let listaFilmes = [];
let filmesSelecionados = [];
let pagina = 0;
let id = 0;


btnTema.addEventListener('click', () => {
    btnTema.classList.toggle('dark');
    btnTema.classList.contains('dark') ? btnTema.src = './assets/dark-mode.svg' : btnTema.src = './assets/light-mode.svg';
    btnTema.classList.contains('dark') ? btnNext.src = './assets/seta-direita-branca.svg' : btnNext.src = './assets/seta-direita-preta.svg';
    btnTema.classList.contains('dark') ? btnPrev.src = './assets/seta-esquerda-branca.svg' : btnPrev.src = './assets/seta-esquerda-preta.svg';

    if (btnTema.classList.contains('dark')) {
        root.style.setProperty('--background-color', '#242424');
        root.style.setProperty('--input-border-color', '#979797');
        root.style.setProperty('--color', '#FFF');
        root.style.setProperty('--shadow-color', '0px 4px 8px rgba(255, 255, 255, 0.15)');
        root.style.setProperty('--highlight-background', '#454545');
        root.style.setProperty('--highlight-color', '#FFF');
        root.style.setProperty('--highlight-description', '#FFF');
    } else {
        root.style.setProperty('--background-color', '#FFF');
        root.style.setProperty('--input-border-color', '#979797');
        root.style.setProperty('--color', '#000');
        root.style.setProperty('--shadow-color', '0px 4px 8px rgba(0, 0, 0, 0.15)');
        root.style.setProperty('--highlight-background', '#FFF');
        root.style.setProperty('--highlight-color', 'rgba(0, 0, 0, 0.7)');
        root.style.setProperty('--highlight-description', '#000');
    };
});


function baseInicialFilmes() {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR').then(function (resposta) {
        const promiseBody = resposta.json();

        promiseBody.then(function (body) {
            listaFilmes = body.results;
            divFilme();

        })
    })
}

baseInicialFilmes();



function criarFilme(elemento) {
    const divMovie = document.createElement('div');
    divMovie.classList.add('movie');

    const divMovieInfo = document.createElement('div');
    divMovieInfo.classList.add('movie__info');

    const spanTitle = document.createElement('span');
    spanTitle.classList.add('movie__title');

    const spanRating = document.createElement('span');
    spanRating.classList.add('movie__rating');
    const spanNotaNumero = document.createElement('span');
    const imgFilme = document.createElement('img');

    divMovie.style.backgroundImage = `url('${elemento.poster_path}')`;
    spanTitle.textContent = elemento.title;
    spanNotaNumero.textContent = elemento.vote_average;
    imgFilme.src = "./assets/estrela.svg";

    spanRating.append(spanNotaNumero, imgFilme);
    divMovieInfo.append(spanTitle, spanRating);
    divMovie.append(divMovieInfo)
    divMovies.append(divMovie);


    divMovie.addEventListener('click', () => {

        for (let filme of listaFilmes) {
            if (filme.title === divMovie.firstChild.firstChild.textContent) {
                id = filme.id;
                break;
            }
        }
        modal.classList.remove('hidden');

        fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/' + id + '?language=pt-BR').then((resposta) => {

            const promiseFilmeModal = resposta.json();
            promiseFilmeModal.then((filme) => {

                mTitle.textContent = filme.title;
                mImagem.src = filme.backdrop_path;
                mDescription.textContent = filme.overview;
                mText.textContent = filme.vote_average;

                for (let item of filme.genres) {
                    const mGenre = document.createElement('span');
                    mGenre.classList.add('modal__genre');
                    mGenre.textContent = item.name;
                    mGenres.append(mGenre);
                }
            })
        })
    })
}


closeModal.addEventListener('click', () => {

    while (mGenres.firstChild) {
        mGenres.removeChild(mGenres.firstChild);
    }
    modal.classList.add('hidden');
});


function divFilme() {
    while (movies.firstChild) {
        movies.removeChild(movies.firstChild)
    }
    let contador = 0;
    let limite = 0;

    if (pagina === 0) {
        contador = 0;
        limite = 5;
    } else if (pagina === 1) {
        contador = 5;
        limite = 10;
    } else if (pagina === 2) {
        contador = 10;
        limite = 15;
    } else if (pagina === 3) {
        contador = 15;
        limite = 20;
    }
    for (contador; contador < limite; contador++) {
        if (filmesSelecionados.length) {
            criarFilme(filmesSelecionados[contador])
        } else {
            criarFilme(listaFilmes[contador])
        }
    }

}

btnNext.addEventListener('click', () => {

    if (pagina === 3) {
        pagina = 0;
        divFilme();
    } else {
        pagina++;
        divFilme();
    }
});

btnPrev.addEventListener('click', () => {
    if (pagina === 0) {
        pagina = 3
        divFilme();
    } else {
        pagina--;
        divFilme();
    }
})


input.addEventListener('keydown', (event) => {

    pagina = 0;

    if (event.key !== 'Enter') {
        return
    }

    if (input.value) {
        const promiseResposta = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=' + input.value);

        promiseResposta.then((resposta) => {

            const promiseFilme = resposta.json();
            promiseFilme.then((filme) => {
                listaFilmes = filme.results;
                divFilme();
            })
        })

    } else {
        baseInicialFilmes();
    }


    input.value = '';
})


fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then((resposta) => {
    const promiseGeral = resposta.json();
    promiseGeral.then((geral) => {

        hVideo.style.background = `url('${geral.backdrop_path}') no-repeat center/cover`;
        hTitle.textContent = geral.title;
        hRating.textContent = geral.vote_average;

        hGenres.textContent = geral.genres.map(function (genre) {
            return genre.name;
        }).join(', ');


        hLaunch.textContent = (new Date(geral.release_date)).toLocaleDateString('pt-BR', { year: "numeric", month: "long", day: "numeric" });
        hDescription.textContent = geral.overview;
        console.log(hLaunch);
    })
})

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then((resposta) => {
    const promiseVideo = resposta.json();
    promiseVideo.then((video) => {

        hVideoLink.href = `https://www.youtube.com/watch?v=${video.results[0].key}`;

    })

})






