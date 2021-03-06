
export const onLink = (router, toLink='/') => () => {
  
  if (localStorage.formChanged === '1') {
    let result = window.confirm("If you navigate away from this page you will lose your unsaved changes.");
    if (result) {
      router.push(toLink)  
    }
  } else {
//console.log(toLink);    
	// Re-direct for external GitHub link.
	if(toLink.indexOf('http') != -1) {
		
		var win = window.open(toLink, '_blank');
		win.focus();
		
	} else {
		
		router.push(toLink)
		
	}
	
  }
}


export const setFormChanged = (value) => {
	localStorage.setItem('formChanged', value)
}

export const getFormChanged = () => {
	return localStorage.formChanged
}

export const setInitial = () => {
	setFormChanged(0);
	window.onbeforeunload = null;
	window.onhashchange = null;
}

export const getBcoIdEncoding = (objectId) => {
        //return encodeURIComponent(objectId)
        //console.log(objectId);        
        return objectId.replace('https://beta.portal.aws.biochemistry.gwu.edu/bco/', '')
}
