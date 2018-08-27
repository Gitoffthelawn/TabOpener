var globalToken		= null;

document.addEventListener('DOMContentLoaded', function()
{
	var currentSelector = localStorage.getItem('selector');

	if( currentSelector !== null )
		Utils.getById('inputSelector').value  = currentSelector;

	var ext = new Client();

	chrome.windows.getCurrent((w)=>
	{
		ext.executeOnBackground('RegisterWindow', { window_id : w.id	});
	});


	Utils.getById('urlSubmit').addEventListener('click',(evt)=>
	{
		Utils.stopEvent( evt );

		var links = Utils.getById('urlInput').value.split('\n');

		for(var i=links.length-1;i>=0;i--)
		{
			if( links[i].trim() === '')
			{
				links.splice( i ,1 );
			}
		}

		if( links.length > 0 )
		{
			ext.executeOnBackground('OpenLinks',{links: links});
		}
	});

	let anchorSections	= Array.from( Utils.getAll('[data-open-section]') );
	anchorSections.forEach((anchor)=>
	{
		anchor.addEventListener('click',(evt)=>
		{
			anchorSections.forEach((a)=>a.classList.remove('active') );
			anchor.classList.add('active');
			let settings	= '[data-open-section="'+anchor.getAttribute('data-open-section')+'"]';
			localStorage.setItem('tabSettings', settings );

			let sections = Array.from(Utils.getAll('[data-section]'));

			sections.forEach((section)=>
			{
				section.classList.add('hidden');
			});

			let openSection = Utils.getFirst('[data-section="'+anchor.getAttribute('data-open-section')+'"]');
			openSection.classList.remove('hidden');
		});
	});

	Utils.getById('openSelector').addEventListener('click',(evt)=>
	{

		Utils.stopEvent( evt );
		ext.executeOnClients('OpenSelectors',{ selector: Utils.getById('inputSelector').value })
		.then((response)=>
		{
			console.log('Send succesfully');
		})
		.catch((e)=>{ console.error( e );});

		localStorage.setItem('selector', Utils.getById('inputSelector').value  );

	});

	Utils.getById('saveSettings').addEventListener('click',(evt)=>
	{
		//Utils.stopEvent( evt );
		let request  = {};

		request.close_after = parseInt( Util.getById('secondsToClose').value,10 );
		request.max_tabs 	= parseInt( Util.getById('maxTabs').value,10 );
		request.request_focus = Util.getById('request_focus').checked ? true : false;
>>>>>>> 7a93458c9d9ea24dff4cb4bc891aeb9b9d9d7f69
		ext.executeOnBackground('SaveSettings', request );
	});

	Util.getById('clearQueue').addEventListener('click',(evt)=>
	{
		ext.executeOnBackground('ClearQueue', {});
	});


	let tabSettings = localStorage.getItem('tabSettings');

	if( tabSettings !== null )
	{
		document.querySelector( tabSettings ).click();
	}

	try
	{
		let settings = JSON.parse( localStorage.getItem('settings') );

		if( settings )
		{
			Util.getById('secondsToClose').value = settings.close_after;
			Util.getById('maxTabs').value = settings.max_tabs;

			Util.getById('request_focus').checked = 'request_focus' in settings && settings.request_focus;
		}
	}
	catch(e)
	{
		console.log('error',e);
	}

});
