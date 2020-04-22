
export const onLink = (router, toLink='/') => () => {
  console.log(router)
  if (localStorage.formChanged === '1') {
    let result = window.confirm("You will be lost data. Please confirm.");
    if (result) {
      router.push(toLink)  
    }
  } else {
    
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

export const getBcoNumber = (objectId) => {
  return objectId.replace(window.location.origin + '/bco/', '')
}