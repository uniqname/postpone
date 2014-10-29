###!
@name          postpone.polyfill
@description   implementation of postpone getAttribute
                (https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/
                    ResourcePriorities/Overview.html#attr-postpone)
@version       @@version - @@date
@author        Cory Brown
@copyright     Copyright 2013 by Intellectual Reserve, Inc.
###
window.addEventListener 'DOMContentLoaded', () ->

    # Prefix for the attribute to be postponed.
    srcAttrId = 'data-postpone-'

    supportsTestImg = document.createElement 'img'

    supportsAttr = (el, attr) ->
        return !!(attr in el)

    assessPostopnablity = (el) ->

        # Allows for authors to use a data- attr to act as the postpone boolean attr for validation
        postponeName = if el.hasAttribute('data-postpone') then 'data-postpone' else 'postpone'
        postponedAttr = do ->
            for attr, i in el.attributes
                attr = attr.name
                if attr.match srcAttrId
                    return attr.replace srcAttrId, ''

        variance = parseInt(el.getAttribute postponeName, 10)
        variance = if isNaN variance then 0 else variance

        # delta vars: when value <= 0,
        # el is`in view` along respective axis and direction.

        # delta of top edge of element to bottom edge of viewport
        deltaVPB = el.offsetTop - window.innerHeight - window.scrollY

        # delta of bottom edge of element to top edge of viewport
        deltaVPT = window.scrollY - (el.offsetTop + el.offsetHeight)

        #delta of right edge of element from left edge of viewport
        deltaVPL = window.scrollX - (el.offsetLeft + el.offsetWidth)

        #delta of left edge of element from right edge of viewport
        deltaVPR = el.offsetLeft - (window.scrollX + window.innerWidth)

        distanceFromInView = Math.max deltaVPT, deltaVPB, deltaVPL, deltaVPR, 0

        distanceFromTrigger = distanceFromInView - variance

        # Postpone no more
        if distanceFromTrigger <= 0
            src = el.getAttribute srcAttrId + postponedAttr
            if src
                el[postponedAttr] = src
                el.removeAttribute srcAttrId + postponedAttr
                el.removeAttribute 'postpone'


    # handoff to client if it supports postpone
    if supportsAttr(supportsTestImg, 'postpone')

        Array.prototype.forEach.call document.querySelectorAll('[postpone], [data-postpone]'), (el) ->
            postponedAttr = do ->
                for i, attr of el.attributes
                    attr = attr.name
                    if attr.match srcAttrId
                        return attr.replace srcAttrId, ''

            el[postponedAttr] = el.getAttribute(srcAttrId + postponedAttr)
            el.removeAttribute(srcAttrId + postponedAttr)

    else

        assessPostopnablity el for el in document.querySelectorAll '[postpone], [data-postpone]'

        window.addEventListener 'scroll', (e) ->
            assessPostopnablity el for el in document.querySelectorAll '[postpone], [data-postpone]'

        window.addEventListener 'resize', (e) ->
            assessPostopnablity el for el in document.querySelectorAll('[postpone], [data-postpone]')
