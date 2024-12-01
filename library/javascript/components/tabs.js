const CYCLE_TIME = 4000


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

var tabsContainers = document.querySelectorAll('.ui.tabs-container')
for (var i = 0; (tabsContainers !== null) && (i < tabsContainers.length); i++) {
    
    
    //append dot containers for milestone tabs
    if(tabsContainers[i].className.split(" ").indexOf("milestone") != -1)
    {
        if(tabsContainers[i].children !== null)
        {
            const tabsList = tabsContainers[i].getElementsByClassName("tabs")
            if(tabsList !== null)
            {
                const tabs = tabsList[0]
                if(tabs !== null)
                {
                    const tabList = tabs.getElementsByClassName("tab")
                    if(tabList)
                    {
                        const size = tabList.length
                        for(var j = 0; j < size; j++)
                        {
                            const dotContainer = document.createElement("div")
                            dotContainer.className = "ms-dot"
                            tabList[j].appendChild(dotContainer)
                        }
                    } 
                }
                }
        }   
    }
    // Assign IDs
    const tabsHash = makeid(15)
    var tabIterator = 0;
    var contentIterator = 0
    if(tabsContainers[i].children){
        const tabsIDAssignment = tabsContainers[i].children[0]
        const contentsIDAssignment = tabsContainers[i].children[1]

        for(var j = 0; j < tabsIDAssignment.children.length; j++){
            tabsIDAssignment.children[j].id = `tabs-${tabsHash}-tab-${j}`
        }

        for(var j = 0; j < contentsIDAssignment.children.length; j++){
            contentsIDAssignment.children[j].id = `tabs-${tabsHash}-content-${j}`
        }
    }


    const tabsList = tabsContainers[i].getElementsByClassName('tabs')
    const contentsList = tabsContainers[i].getElementsByClassName('contents')

    if ((tabsList !== null) && (contentsList !== null)) {

        const tabs = tabsList[0]
        const contents = contentsList[0]

        if ((tabs !== null) && (contents !== null) && (tabs.length === contents.length)) {

            // const tabsHash = makeid(15)
            const tabList = tabs.getElementsByClassName('tab')
            const contentList = contents.getElementsByClassName('content')
            const size = tabList.length


            if (tabList !== null && contentList !== null) {

                // Make the first tab active by default
                tabList[0].classList += " active"
                contentList[0].style.display = "block"


                //do only for events gallery type tabs
                if(tabsContainers[i].className.split(" ").indexOf("event") != -1) {
                const tabID = tabList[0].id
                const firstTabDetail = tabID.split('-')
                const tabHash = firstTabDetail[1]
                const tabIndex = firstTabDetail[3]

                let activeIndex = 0;
                let autoCycle = true;
                let interval;

                function makeTabActive(tabElement, currentContent, nextContent) {
                    for (var j = 0; j < size; j++) {
                        tabList[j].classList.remove('active')

                    }
                    tabElement.classList.add('active');
                    currentContent.style.display = "none"
                    nextContent.style.display = "block"
                    activeIndex = Array.from(tabList).indexOf(tabElement);
                }

                function stopAutoCycle () {
                    autoCycle = false;
                    clearInterval(interval);
                }

                function cycleTabs() {
                    if (!autoCycle) return;
                    
                    const currentActiveContent = document.getElementById(`tabs-${tabHash}-content-${activeIndex}`)
                    activeIndex = (activeIndex + 1) % tabList.length;
                    const nextActiveTab = document.getElementById(`tabs-${tabHash}-tab-${activeIndex}`)
                    const nextActiveContent = document.getElementById(`tabs-${tabHash}-content-${activeIndex}`)
                    makeTabActive(nextActiveTab, currentActiveContent, nextActiveContent);
                }

                interval = setInterval(cycleTabs, CYCLE_TIME);
            }

                // Handle click
                for (var j = 0; j < size; j++) {

                    tabList[j].addEventListener('click', function (e) {
                        e.stopPropagation()
                        e.preventDefault()

                        if (e.target) {

                            if (!e.target.classList.contains("active")) {

                                // Find the element that is active and render it inactive
                                const activeTabs = e.target.parentElement.getElementsByClassName('active')
                                if (activeTabs && activeTabs[0]) {
                                    const activeTab = activeTabs[0]
                                    activeTab.classList.toggle("active", false)
                                    const activeID = activeTab.id

                                    const tabDetail = activeID.split('-')
                                    const activeContent = document.getElementById(`tabs-${tabDetail[1]}-content-${tabDetail[3]}`)
                                    activeContent.style.display = "none"
                                }

                                // Render the current element active
                                e.target.classList += " active"
                                const targetDetail = e.target.id.split('-')
                                const targetContent = document.getElementById(`tabs-${targetDetail[1]}-content-${targetDetail[3]}`)
                                targetContent.style.display = "block"
                                stopAutoCycle();

                            }

                        }
                    }) 
                }

            } else {
                console.error("List of tabs or content is NULL for ", tabsContainers[i])
            }

        } else {
            console.error("Tabs and content don't match up in ", tabsContainers[i])
        }

    }

}
