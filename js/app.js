(function() {
  Date.prototype.yyyymmdd = function() {
	let mm = this.getMonth() + 1;
	let dd = this.getDate();

	return [this.getFullYear(),
			(mm>9 ? '' : '0') + mm,
			(dd>9 ? '' : '0') + dd
		  ].join('-');
  };

  const dates = {
	startDate: function() {
	  const startDate = new Date();
	  startDate.setDate(startDate.getDate() - 7);
	  return startDate.yyyymmdd();
	},
	endDate: function() {
	  const endDate = new Date();
	  return endDate.yyyymmdd();
	}
  }

  const app = {
	apiURL: 'https://dev.starfeeling.net/api/v1/search',
	cardTemplate: document.querySelector('.card-template')
  }

  app.updateTrends = function(trends) {
	const trendsRow = document.querySelector('.trends');
	for(let i = 0; i < trends.length; i++) {
	  const trend = trends[i];
	  trendsRow.appendChild(app.createCard(trend));
	}
  }

  app.createCard = function(trend) {
	const card = app.cardTemplate.cloneNode(true);
	card.classList.remove('card-template')
	card.querySelector('.card-img').setAttribute('src', trend.thumbnail_url)
	card.querySelector('.card-img').setAttribute('alt', trend.alt)
	card.querySelector('.card-text').textContent = trend.name
	card.querySelector('.card-sku').textContent = trend.sku
	card.querySelector('.card-link').setAttribute('href', trend.sku)
	card.querySelector('.card-link').setAttribute('target', '_blank')
	return card;
  }

  app.getTrends = function() {
	const networkReturned = false;
	if ('caches' in window) {
		caches.match(app.apiURL).then(function (response) {
		if (response) {
			response.json().then(function (trends) {
			const products = trends.response.hits
			console.log('From cache...')
			if(!networkReturned) {
			  app.updateTrends(products);
			}
		  });
		}
	  });
	}

	fetch(app.apiURL)
	.then(response => response.json())
	  .then(function (trends) {
		const products = trends.response.hits
		console.log('From server...')
		app.updateTrends(products)
	  networkReturned = true;
	  }).catch(function (err) {
		// console.log(err);
	  // Error :(
	});
  }

  document.addEventListener('DOMContentLoaded', function() {
	app.getTrends()
	// const refreshButton = document.querySelector('.refresh');
	// refreshButton.addEventListener('click', app.getTrends)
  })

  
})()