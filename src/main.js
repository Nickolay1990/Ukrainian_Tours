import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// DOM elements
const DOM = {
	menuButtons: document.querySelectorAll('[data-menuButton]'),
	contentHero: document.querySelector('.hero .container'),
	darkWindow: document.querySelector('#dark-window'),
	header: document.querySelector('#pageheader'),
	menu: document.querySelector('#mobile-menu'),
	modalButtons: document.querySelectorAll('[data-modal-window]'),
	modal: document.querySelector('#backdrop'),
	upcomingButtonRight: document.querySelector('#upcoming-button-right'),
	upcomingButtonLeft: document.querySelector('#upcoming-button-left'),
	upcomingList: document.querySelector('#upcoming-tours-list'),
	upcomingModalItems: document.querySelectorAll('.upcoming-modal-list-item'),
	upcomingNavButtons: document.querySelectorAll('.upcoming-modal-list-item-listbtn-item'),
	swapCardButtonsList: document.querySelectorAll('.upcoming-modal-list-item-listbtn'),
	upcomingToggleModalButtons: document.querySelectorAll('[data-toggle-modal]'),
	reviewsBlock: document.querySelector('.reviews-block'),
	reviewsCards: document.querySelectorAll('.reviews-inner'),
	galleryButonRight: document.querySelector('#galery-button-right'),
	galleryButonLeft: document.querySelector('#galery-button-left'),
	galleryList: document.querySelector('.galery-list'),
};

// open and close mobile menu

DOM.menuButtons.forEach(button => button.addEventListener('click', mobileMenuHandler));

function mobileMenuHandler() {
	DOM.menu.classList.toggle('open-menu');
	DOM.darkWindow.classList.toggle('dark-window');
	DOM.header.classList.toggle('padding-for-tablet-menu');
	changeVisuallyHidden([DOM.contentHero, ...DOM.menuButtons]);
}

function changeVisuallyHidden(elements) {
	elements.forEach(element => element.classList.toggle('visually-hidden'));
}

// open and close modal window

DOM.modalButtons.forEach(button => button.addEventListener('click', modalWindowHandler));

function modalWindowHandler() {
	DOM.modal.classList.toggle('is-open');
}

// swap upcoming tours

DOM.upcomingButtonRight.addEventListener('click', upcomingButtonRightHandler);
DOM.upcomingButtonLeft.addEventListener('click', upcomingButtonLeftHandler);

const stepUpcoming = innerWidth < 768 ? 326 : 374;
let translateUpcoming = 0;

function upcomingButtonRightHandler() {
	translateUpcoming += stepUpcoming;
	DOM.upcomingList.style.transform = `translate(-${translateUpcoming}px)`;
	DOM.upcomingButtonLeft.disabled = false;
	if (innerWidth >= 768 || translateUpcoming === 652) {
		this.disabled = true;
	}
}

function upcomingButtonLeftHandler() {
	translateUpcoming -= stepUpcoming;
	DOM.upcomingList.style.transform = `translate(-${translateUpcoming}px)`;
	DOM.upcomingButtonRight.disabled = false;
	if (translateUpcoming === 0) {
		this.disabled = true;
	}
}

// resize

const breakpoints = [768, 1440, 1920];

breakpoints.forEach(bp => {
	const maxWidth = window.matchMedia(`(max-width: ${bp - 1}px)`);
	const minWidth = window.matchMedia(`(min-width: ${bp}px)`);

	maxWidth.addEventListener('change', resizeHandler);
	minWidth.addEventListener('change', resizeHandler);
});

function resizeHandler(event) {
	if (event.matches) {
		location.reload();
	}
}

// swap upcoming days mobile

document.addEventListener('DOMContentLoaded', swapDays);

const classSelected = 'selected-card-modal-days';
const classRight = 'right-position';
const classLeft = 'left-position';

function swapDays() {
	DOM.upcomingModalItems.forEach((item, index) => {
		let startX = 0;
		let endX = 0;

		item.addEventListener('touchstart', event => {
			startX = event.touches[0].clientX;
		});

		item.addEventListener('touchend', event => {
			endX = event.changedTouches[0].clientX;
			const diffX = endX - startX;

			if (diffX < -50 || diffX > 50) {
				checkCardPosition.call(item, index, diffX);
			}
		});
	});
}

function checkCardPosition(index, diffX) {
	if (this.nextElementSibling && diffX < -50) {
		moveCard(this, classSelected, classLeft);
		moveCard(this.nextElementSibling, classRight, classSelected);
		paintButton(index + 1);
	} else if (this.previousElementSibling && diffX > 50) {
		moveCard(this, classSelected, classRight);
		moveCard(this.previousElementSibling, classLeft, classSelected);
		paintButton(index);
	}
}

function moveCard(card, removeClass, addClass) {
	card.classList.remove(removeClass);
	card.classList.add(addClass);
}

function paintButton(index) {
	DOM.upcomingNavButtons[index].classList.toggle('selected-card-days');
}

// swap upcoming days desctop

if (innerWidth >= 1440) {
	DOM.swapCardButtonsList.forEach(button => button.addEventListener('click', swapDescHandler));
}

function swapDescHandler(event) {
	if (!event.target.classList.contains('upcoming-modal-list-item-listbtn-item')) {
		return;
	}

	const buttons = Array.from(this.children);
	const cards = this.closest('.upcoming-modal').querySelectorAll('.upcoming-modal-list-item');

	paintButtonsDesc(buttons, buttons.indexOf(event.target));
	swapCardsDesc(cards, buttons.indexOf(event.target));
}

function paintButtonsDesc(buttons, index) {
	buttons.forEach((button, i) => {
		if (i > index) {
			button.classList.remove('selected-card-days');
			return;
		}
		button.classList.add('selected-card-days');
	});
}

function swapCardsDesc(cards, index) {
	let classForAdd = classLeft;
	cards.forEach((card, i) => {
		card.classList.remove(classSelected, classRight, classLeft);
		if (i === index) {
			classForAdd = classRight;
			card.classList.add(classSelected);
			return;
		}
		card.classList.add(classForAdd);
	});
}

// open and close upcoming days

DOM.upcomingToggleModalButtons.forEach(button => button.addEventListener('click', openUpcomingModal));

function openUpcomingModal() {
	const modal = document.querySelector(`[data-modal="${this.dataset.toggleModal}"]`);
	modal.classList.toggle('is-open');
}

// reviews show back photo

DOM.reviewsBlock.addEventListener('click', getAroundCard);

function getAroundCard(event) {
	if (!event.target.closest('.reviews-card-review-button')) {
		return;
	}
	const cards = window.innerWidth >= 1440 ? DOM.reviewsCards : [event.target.closest('.reviews-inner')];
	cards.forEach(card => card.classList.toggle('reviews-go-to-back'));
}

// swap gallery right

DOM.galleryButonRight.addEventListener('click', galleryRightHandler);

const stepGallery = innerWidth < 768 ? 300 : innerWidth >= 1440 ? 1190 : 748;
let translateGallery = 0;

function galleryRightHandler() {
	translateGallery += stepGallery;

	if (translateGallery === 300) {
		translateGallery -= 15;
	}

	DOM.galleryList.style.transform = `translate(-${translateGallery}px)`;
	DOM.galleryButonLeft.disabled = false;

	if ([2085, 2244, 3570].includes(translateGallery)) {
		this.disabled = true;
	}
}

// swap gallery left

DOM.galleryButonLeft.addEventListener('click', galleryLefttHandler);

function galleryLefttHandler() {
	if ([2085, 2244, 3570].includes(translateGallery)) {
		DOM.galleryButonRight.disabled = false;
	}

	translateGallery = translateGallery === 285 ? 0 : translateGallery - stepGallery;

	DOM.galleryList.style.transform = `translate(-${translateGallery}px)`;
	if (!translateGallery) {
		this.disabled = true;
	}
}

// open modal gallery

let gallery = new SimpleLightbox('.galery-list a', {
	captionsData: 'alt',
	loop: false,
	docClose: false,
});
