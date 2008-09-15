/**
 * Bricamoo Tag Cloud
 * Classe pour la fabrication de nuage de tags.
 * Se construit avec en envoyant un élément ul au constructeur.
 * La structure attendu est:
 * <ul>
 * 	<li><a href="/url/">Nom du tag<span>(X)</span></a>
 * 	...
 * </ul>
 *
 * X est le nombre d'occurences du tag.
 * 
 * @copyright Olivier Clavel (olivier DOT clavel AT gmail DOT com)
 * @depends mootools 1.2 (core et plugins)
 * @todo - déterminer les dépendances exactes (il faut pas la totale non plus.
 * 	 - amélioration des perfs ?...
 * 	 - rendre les effets configurables
 */
var bmTagCloud = new Class({

	Implements: [Options, Events],

	options: {
		/* Taille mini des tags en % */
		minPercent: 70,
		/* Taille maxi des tags en % */
		maxPercent: 120,
		/* Format par défaut pour le titre dans le tip */
		tipFormat: 'Il y a %%number%% éléments pour le tag %%tag%%',
		/* Appliquer une annimagion aux tags */
		annimate: true,
	 	/* Durée de l'annimation en ms */
		duration: 1000,
		/* Transition à utiliser pour l'annimation */
		transition: Fx.Transitions.Quart.easeInOut
	},

	/* Valeurs par défaut des propriétés */
	setDefaults: function() {
		/* Nombre d'occurence min dans la liste de tags */
		this.min = 0;
		/* Nombre d'occurences max dans la liste de tags */
		this.max = 0;
		/* Multiplicateur pour la taille des tags */
		this.sizeMultiplier = 0;
		/* Liste des tailles de tags et des éléments ou appliquer la taille */
		this.tagHash = new Array();
		/* Liste des tooltips sur les tags */
		this.tagTips = new Array();
	},
	
	/* Constructeur de la classe */
	initialize: function(element, options) {
		this.tagRoot = element;
		this.setOptions(options);
		if (!this.options.annimate) {
			this.tagRoot.setStyle('visibility', 'hidden');
		}
		this.setDefaults();
		this.parseTags();
		this.resizeTags();
	},
	
	/* Parse tous les tags de la liste */
	parseTags: function() {
		var listElements = this.tagRoot.getElements('li');
		listElements.each( function(listElement) {
			/* On récupère le lien, le nom du tag et son poids (occurences) */
			var tagLink = listElement.getElement('a');
			var tagName = tagLink.firstChild.nodeValue;
			var tagWeight = this.getTagWeight(tagLink.getElement('span'));

			/* On enregistre le min/max pour les occurences */
			this.setMinMax(tagWeight);
			
			/* On enregistre dans un array avec le poids
 			le poid et le tag correspondant */
			this.tagHash.include([tagWeight, tagLink]);
			
			/* On change le title du lien avec notre string formaté 
 			et on cré un tooltip sur le lien */
			tagLink.title = this.getFormatedTip(tagName, tagWeight);
			this.tagTips.include(new Tips(tagLink));
		}, this);
	},

	/* Met les tags à la bonne taille et les annime le ca échéant */
	resizeTags: function() {
		this.tagHash.each(function(tagInfo) {
			var size = this.getFontSize(tagInfo[0]);
			var tag = tagInfo[1];	
			if (this.options.annimate) {
				tag.set('tween', {
					duration: this.options.duration,
					transition: this.options.transition,
					unit: '%'
				});
				tag.tween('font-size', 100, size);
			} else {
				tag.setStyle('font-size', size+'%');
			}
				
		}, this);
		if (!this.options.annimate) {
			this.tagRoot.setStyle('visibility', 'visible');
		}
	},

	/**
 	 * Récupère le poids du tag à l'intérieur des parenthèse du span
 	 */ 
	getTagWeight: function(weightElement)  {
		var rawText = weightElement.get('text');
		var matches = rawText.match(/\((\d{1,3})\)/);
		return matches[1];
	},

	/* Enregistre les valeurs min et max des occurences de tag */
	setMinMax: function(currentOccurence) {
		if (this.min == 0 || this.min > currentOccurence) {
			this.min = currentOccurence;
		}
		if (this.max == 0 || this.max < currentOccurence) {
			this.max = currentOccurence;
		}
	},

	/* Retourne le tip formaté */
	getFormatedTip: function(tagName, tagWeight) {
		var formated = this.options.tipFormat.replace(/%%number%%/, tagWeight);
		formated = formated.replace(/%%tag%%/, tagName);
		return formated;
	},

	/* Calcule la taille du texte pour le tag */
	getFontSize: function(occurence) {
		if (this.sizeMultiplier == 0) {
			this.sizeMultiplier = (this.options.maxPercent-this.options.minPercent)/(this.max-this.min); 
		}
    		var size = this.options.minPercent + ((this.max-(this.max-(occurence-this.min)))*this.sizeMultiplier);
		return size; 
	}
});

