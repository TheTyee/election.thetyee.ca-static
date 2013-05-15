// Leaflet
function getOpacity(e){return e=="Definitely"?"0.8":e=="Likely"?"0.5":"0.1"}function style(e){return{weight:2,dashArray:"",opacity:.2,color:"black",fillOpacity:"0.8",fillColor:e.properties.party?e.properties.party.colour:"rgba(255,255,255,.1)"}}function zoomToRegion(e){map.fitBounds(e)}function highlightFeature(e){var t=e.target;t.setStyle({weight:5});!L.Browser.ie&&!L.Browser.opera&&t.bringToFront();info.update(t.feature.properties)}function resetHighlight(e){geojson.resetStyle(e.target);info.update()}function goToRidingProfile(e){var t=e.target,n=t.feature.properties.name;n=n.toLowerCase().replace(/\s/g,"-");url="/riding/"+n;window.location=url}function onEachFeature(e,t){t.on({mouseover:highlightFeature,mouseout:resetHighlight,click:goToRidingProfile})}function show_options(e){message_div.children().remove();if(e.length>1){message_div.append("<p>Which of these looks like your address?</p>").removeClass("alert-error alert-success").addClass("alert alert-warning");$.each(e,function(){var e=this;message_div.append($('<a href="#" onClick="event.preventDefault();">'+this.formatted_address+"</a><br />").click(function(){districts_for_geocoder_result(e)}))})}else e.length==0?message_div.append("<p>No match for that address.</p>").removeClass("alert-warning").addClass("alert alert-error"):districts_for_geocoder_result(e[0])}function districts_for_geocoder_result(e){message_div.children().remove();message_div.append("<p>"+e.formatted_address+"</p>");var t=e.geometry.location.lat(),n=e.geometry.location.lng(),r="http://represent.opennorth.ca/boundaries/?callback=?&contains="+t+","+n;$.getJSON(r,function(e){e=e.objects;e.length==0&&message_div.append("<p>No ridings found. Is that address in Canada?</p>").removeClass("alert-success").addClass("alert-error");$.each(e,function(e){if(this.boundary_set_name=="British Columbia electoral district"){var r=this.name.toLowerCase().replace(/\s/g,"-");message_div.append('<p>Your riding is <a href="/riding/'+r+'">'+this.name+", visit the riding profile</a>.</p>").removeClass("alert-warning").addClass("alert alert-success");map.setView([t,n],14)}})})}var map=L.map("map",{doubleClickZoom:!1}).setView([52.2385,-123.1185],6);L.tileLayer("http://{s}.tile.cloudmade.com/8df2e4e99eb94de2a136db10bf4e9afa/997/256/{z}/{x}/{y}.png",{}).addTo(map);L.control.locate().addTo(map);var geojson;geojson=L.geoJson(ridingData,{style:style,onEachFeature:onEachFeature}).addTo(map);var VanSouthWest=new L.LatLng(48.927,-123.186),VanNorthEast=new L.LatLng(49.398,-122.353),vancouver=new L.LatLngBounds(VanSouthWest,VanNorthEast),VicSouthWest=new L.LatLng(48.268,-124.845),VicNorthEast=new L.LatLng(49.183,-123.179),victoria=new L.LatLngBounds(VicSouthWest,VicNorthEast),info=L.control();info.onAdd=function(e){this._div=L.DomUtil.create("div","info");this.update();return this._div};info.update=function(e){this._div.innerHTML=e?"<h4>"+e.name+"</h4><p><strong>Winner:</strong> "+e.winner.fullname+(e.party?' <span class="label label-'+e.party.slug+'" style="background-color: '+e.party.colour+';">'+e.party.shortname+"<span>":"")+"<p>"+e.win_copy+" Click to read more.</p>":'<p><h4>Welcome to Tyee’s riding-by-riding source for election issues and action.</h4></p><p>Now updated to reflect the winners of the 2013 B.C. election. Click a riding for fast facts, related stories and more.</p><p><a href="#riding-list">Scroll down</a> for a list of ridings</p><p>Zoom to <a href="#" onClick="event.preventDefault();zoomToRegion(vancouver);">Lower Mainland ridings</a>.</p><p>Zoom to <a href="#" onClick="event.preventDefault();zoomToRegion(victoria);">Victoria-area ridings</a>.</p>'};info.addTo(map);var search=L.control({});search.onAdd=function(e){var t=L.DomUtil.create("div","search");this._div=t;this.update();L.DomEvent.disableClickPropagation(this._div);return this._div};search.update=function(){this._div.innerHTML='<p><strong>Not sure what your riding is?</strong><br />Type your address in the box below and we’ll get you there.<form id="riding-search" class="riding-search"><input type="text" size="25" placeholder="Your address: Street, City." autofocus />&nbsp;<input type="submit" value="Go" /></form><div id="riding-message" class="riding-message"></div>'};search.addTo(map);var message_div=$(".riding-message");$(".riding-search").submit(function(e){e.preventDefault();var t=new google.maps.Geocoder,n=$("#riding-search input[type=text]").val(),r=$("#riding-search-mobile input[type=text]").val(),i=n?n:r;t.geocode({address:i,region:"ca"},function(e,t){show_options(e)})});if(navigator.geolocation){var geocoder=new google.maps.Geocoder;$("#geolocate-span").show();$("#geolocate-link").click(function(e){e.preventDefault();navigator.geolocation.getCurrentPosition(function(e){var t=new google.maps.LatLng(e.coords.latitude,e.coords.longitude);geocoder.geocode({latLng:t},function(e,t){show_options(e)})})})};