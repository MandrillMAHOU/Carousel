(function(){
	var imgIndex = 1; // index range [0, total # of imgs + 1], cuz adds 2 imgs(1st and last) at two ends of carousel
	var autoplayTimer; 
	var moveTimer; // timer for animation of carousel
	var banner;
	var imgCount; // number of imgs in carousel(including the cloned 2 imgs)
	var containerLeft; // offset left of container
	var lastPos; // last position during drag
	const SPEED = 20; // move speed of img per 10ms
	const IMG_WIDTH = 1000;
	const AUTOPLAY_SPEED = 2000;

	window.onload = function(){
		document.querySelector(".next").addEventListener("click", ()=>{changeBanner(imgIndex + 1)});
		document.querySelector(".prev").addEventListener("click", ()=>{changeBanner(imgIndex - 1)});
		// when mouse moves into banner, auto-show stops
		let container = document.querySelector(".carousel-container");
		container.addEventListener("mouseover", ()=>{
			clearInterval(autoplayTimer);
		});
		container.addEventListener("mouseout", ()=>{
			autoPlay();
		});
		// drags the banner only when mouse is down
		container.addEventListener("mousedown",function(e){
			lastPos = e.clientX;
			document.addEventListener("mousemove", dragBanner);
		})
		document.addEventListener("mouseup", ()=>{
			document.removeEventListener("mousemove", dragBanner);
			justifyPos();
		})
		initCarousel();
		autoPlay();
	}

	/**
	 * Clones the 1st and last img in carousel, append to the end and head of carousel respectively
	 * and sets the init states of the carousel
	 */
	function initCarousel() {
		banner = document.querySelector(".banner");
		containerLeft = document.querySelector(".carousel-container").offsetLeft;
		// add nav dots
		let dotCount = banner.children.length;
		for (let i = 0; i < dotCount; i++) {
			let dot = document.createElement("div");
			dot.classList.add("dot");
			dot.addEventListener("click",()=>{
				changeBanner(i + 1);
			});
			document.querySelector(".dot-container").appendChild(dot);
		}
		// init banner
		let firstImg = banner.children[0];
		let lastImg = banner.children[banner.children.length - 1];
		banner.appendChild(firstImg.cloneNode(true));
		banner.insertBefore(lastImg.cloneNode(true), firstImg);
		imgCount = banner.children.length;
		banner.style.left = (-imgIndex * IMG_WIDTH) + "px";
		// prevents the default drag behaviors of imgs
		let allImgs = banner.children;
		for (let i = 0; i < imgCount; i++) {
			allImgs[i].ondragstart = function(e){
				e.preventDefault();
			}
		}
		updateDots();
	}

	/**
	 * Auto plays the carousel when mouse is out of the range of container
	 */
	function autoPlay() {
		autoplayTimer = setInterval(()=>{
			changeBanner(imgIndex + 1);
		}, AUTOPLAY_SPEED);
	}

	/**
	 * Changes the carousel only when img index not equals to old index(including the cases where
	 * carousel is at the position of the first and last cloned node
	 * @param  {num} newIndex - new img index
	 */
	function changeBanner(newIndex) {
		if (imgIndex != newIndex) {
			if ((imgIndex != 0 || newIndex != imgCount - 2) && (imgIndex != imgCount - 2 || newIndex != 0) && 
				(imgIndex != 1 || newIndex != imgCount - 1) && (imgIndex != imgCount - 1 || newIndex != 1)) {
				imgIndex = newIndex;
				let banner = document.querySelector(".banner");
				if (imgIndex > imgCount - 1) {
					imgIndex = 2;
					banner.style.left = -1 * IMG_WIDTH + "px";
				} else if (imgIndex < 0) {
					imgIndex = 2;
					banner.style.left = - (imgCount - 2) * IMG_WIDTH + "px";
				}
				moveSlide();
			}
		}
	}

	/**
	 * Moves the banner from one img to its adjacent one
	 */
	function moveSlide() {
		clearInterval(moveTimer);
		let banner = document.querySelector(".banner");
		// tests if the carousel move left or right, -speed=>left, speed=>right
		let speed = banner.offsetLeft > -imgIndex * IMG_WIDTH ? -SPEED : SPEED; 
		moveTimer = setInterval(function(){
			let left = 0;
			// consider the last move step during slide change
			if (Math.abs(banner.offsetLeft + imgIndex * IMG_WIDTH) < SPEED) {
				left = -imgIndex * IMG_WIDTH;
			} else {
				left = banner.offsetLeft + speed;
			}
			if (left == -imgIndex * IMG_WIDTH) {
				clearInterval(moveTimer);
			}
			banner.style.left = left + 'px';
		}, 10);
		updateDots();
	}

	/**
	 * Updates the active status of nav dots
	 */
	function updateDots() {
		let allDots = document.querySelectorAll(".dot");
		let dotCount = allDots.length;
		for (let i = 0; i < dotCount; i++) {
			if (i + 1 == imgIndex || (imgIndex == 0 && i == dotCount - 1) || (imgIndex == dotCount + 1 && i == 0)) {
				allDots[i].classList.add("active");
			} else {
				allDots[i].classList.remove("active");
			}
		}
	}

	/**
	 * Drags the banner based on the moving distance of mouse
	 * @param  {obect} e - mousemove event
	 */
	function dragBanner(e) {
		// console.log(banner.offsetLeft);
		let dragDistance = e.clientX - lastPos;
		lastPos = e.clientX;
		if (banner.offsetLeft < -(imgCount - 1) * IMG_WIDTH) {
			imgIndex = 2;
			banner.style.left = -1 * IMG_WIDTH + "px";
		} else if (banner.offsetLeft > 0) {
			imgIndex = 2;
			banner.style.left = -(imgCount - 2) * IMG_WIDTH + "px";
		}
		banner.style.left = (banner.offsetLeft + dragDistance) + "px";
	}

	/**
	 * When mouse is up, justify the position of banner
	 */
	function justifyPos() {
		imgIndex = Math.round(-banner.offsetLeft / IMG_WIDTH);
		moveSlide();
	}

})();