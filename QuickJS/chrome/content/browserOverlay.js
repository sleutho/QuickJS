//QuickJS 1.0 by eiji.anonremail@gmail.com
//QuickJava 0.4 by Doug Greene

// Update the icons 
function quickJS_updateIcons()
{
    //Load the current settings
    
    var quickJS_prefs = Components.classes["@mozilla.org/preferences-service;1"].
        getService(Components.interfaces.nsIPrefBranch);
        
    var currentSet = quickJS_prefs.getBoolPref("javascript.enabled");
    quickJS_setIcon(currentSet);
    return true;
}

function quickJS_toggle()
{
    var quickJS_prefs = Components.classes["@mozilla.org/preferences-service;1"].
            getService(Components.interfaces.nsIPrefBranch);
      
    var quickJS_currentSet = quickJS_prefs.getBoolPref("javascript.enabled");
    quickJS_setOnOff(!quickJS_currentSet);
}

function quickJS_setOnOff(onOff)
{
    var quickJS_prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefBranch);
      
    quickJS_prefs.setBoolPref("javascript.enabled", onOff);
    quickJS_setIcon(onOff);
}

function quickJS_setIcon(onOff)
{

    var checkbox = document.getElementById("QuickJSButton");
    if(checkbox)
    {
        checkbox.checked = !onOff;
        
        var strbundle = document.getElementById("strings_QuickJS");
        checkbox.setAttribute("tooltiptext", 
            strbundle.getString(onOff ? "valueOn" : "valueOff"));
    }
}


//add button on first run
//from: https://developer.mozilla.org/en/Code_snippets/Toolbar#Adding_button_by_default

window.addEventListener("load", quickJS_RunFirstInit, false);

  
function quickJS_RunFirstInit()
{
    var quickJS_prefs = Components.classes["@mozilla.org/preferences-service;1"].
        getService(Components.interfaces.nsIPrefBranch).
        getBranch("extensions.quickjs.");
            
    var firstRun = quickJS_prefs.getBoolPref("firstrun");
    if (firstRun)
        quickJS_AddToolbarItem();
}
   
function quickJS_AddToolbarItem()
{
    var myId = "QuickJSButton"; // ID of button to add
    var navBar  = document.getElementById("nav-bar");
    var curSet  = navBar.currentSet.split(",");

    if (curSet.indexOf(myId) == -1) {
        var pos = curSet.length;
        var set = curSet.slice(0, pos).concat(myId).concat(curSet.slice(pos));

        navBar.setAttribute("currentset", set.join(","));
        navBar.currentSet = set.join(",");
        document.persist(navBar.id, "currentset");
    
        var quickJS_prefs = Components.classes["@mozilla.org/preferences-service;1"].
	        getService(Components.interfaces.nsIPrefBranch).
                getBranch("extensions.quickjs.");
        quickJS_prefs.setBoolPref("firstrun", false);
        
        try {
            BrowserToolboxCustomizeDone(true);
        } catch (e) {}
    }
}



var quickJS_PrefObserver =
{
    register: function()
    {
        var observingPrefsActive = false;
        var prefService = Components.classes["@mozilla.org/preferences-service;1"]
                                .getService(Components.interfaces.nsIPrefBranchInternal);
        this._branch = prefService.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
        this._branch.addObserver("", this, false);
        quickJS_updateIcons();
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
	        quickJS_updateIcons();
            break;
        }
    }
}

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