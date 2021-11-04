createMap = (cca3, lat, lng) => {
	const mapStyle = new ol.style.Style({
		fill: new ol.style.Fill({
			color: '#567d46'
		}),
		stroke: new ol.style.Stroke({
			color: '#2b3f23',
			width: 1
		})
	})

	const vectorLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
			format: new ol.format.GeoJSON()
		}),
		style: mapStyle
	})

	const map = new ol.Map({
		layers: [vectorLayer],
		target: 'map',
		view: new ol.View({
			center: [0, 0],
			zoom: 2,
			maxZoom: 2
		})
	})

	const highlightStyle = new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: '#f00',
			width: 1
		}),
		fill: new ol.style.Fill({
			color: 'rgba(255,0,0,0.1)'
		})
	})

	const featureOverlay = new ol.layer.Vector({
		source: new ol.source.Vector(),
		map: map,
		style: highlightStyle
	})

	map.on('postrender', () => {
		if (cca3 && vectorLayer.getSource().getFeatureById(cca3)) {
			centerCountry(map, vectorLayer, cca3)
			highlightCountry(featureOverlay, vectorLayer, cca3)
		} else {
			map.getView().setCenter(ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'))
		}
	})
}

highlightCountry = (featureOverlay, vectorLayer, cioc) => {
	let highlight
	const feature = vectorLayer.getSource().getFeatureById(cioc)
	if (highlight) {
		featureOverlay.getSource().removeFeature(highlight)
	}
	if (feature) {
		featureOverlay.getSource().addFeature(feature)
	}
	highlight = feature
}

centerCountry = (map, vectorLayer, cioc) => {
	const feature = vectorLayer.getSource().getFeatureById(cioc)
	if (feature) {
		const extent = feature.getGeometry().getExtent()
		map.getView().fit(extent)
	}
}
