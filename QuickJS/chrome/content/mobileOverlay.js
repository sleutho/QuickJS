//QuickJS 1.1 by eiji.anonremail@gmail.com
//QuickJava 0.4 by Doug Greene

// Update the icons 
var QuickJS = {
	quickJS_updateIcons : function()
	{
	    var currentSet = Services.prefs.getBoolPref("javascript.enabled");
	    this.quickJS_setIcon(currentSet);
	    return true;
	},

	quickJS_toggle : function()
	{
	    var quickJS_currentSet = Services.prefs.getBoolPref("javascript.enabled");
	    this.quickJS_setOnOff(!quickJS_currentSet);
	},

	quickJS_setOnOff : function(onOff)
	{
	    Services.prefs.setBoolPref("javascript.enabled", onOff);
	    this.quickJS_setIcon(onOff);
	},

	quickJS_setIcon : function(onOff)
	{
	    var checkbox = document.getElementById("QuickJSButtonMobile");
	    if(checkbox)
	    {
		checkbox.checked = !onOff;
	    }
	}
};


var quickJS_PrefObserver =
{
    register: function()
    {
        var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                                .getService(Components.interfaces.nsIPrefBranchInternal);
        this._branch = prefService.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
        this._branch.addObserver("", this, false);
        QuickJS.quickJS_updateIcons();
    },

    unregister: function()
    {
      if(!this._branch) return;
      this._branch.removeObserver("", this);
    },

    observe: function(aSubject, aTopic, aData)
    {
        if(aTopic != "nsPref:changed") return;
        // aSubject is the nsIPrefBranch we're observing
        // aData is the name of the pref that's been changed (relative to aSubject)
        switch (aData) {
            case "javascript.enabled":
                // javascript.enabled was changed
	        QuickJS.quickJS_updateIcons();
            break;
        }
    }
};

window.addEventListener('load', quickJS_evtLoad, false);
window.addEventListener('unload', quickJS_evtUnload, false);

function quickJS_evtLoad(evt)
{
   quickJS_PrefObserver.register();
}

function quickJS_evtUnload(evt)
{
   quickJS_PrefObserver.unregister();
}