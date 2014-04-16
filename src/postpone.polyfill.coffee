###!
 @name 			postpone.polyfill
 @description	implementation of postpone attribute (https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/ResourcePriorities/Overview.html#attr-postpone)
 @version		@@version - @@date
 @author		Cory Brown
 @copyright		Copyright 2013 by Intellectual Reserve, Inc.
###

srcAttrName = 'data-src'
supportsTestImg = document.createElement 'img'

supportsAttr = (el, attr) ->
	return !!(attr in el)

assessPostopnablity = (el) ->
	variance =  parseInt(el.getAttribute 'postpone', 10)
	variance = if isNaN variance then 0 else variance

	# delta vars: when value <= 0, el satisfies `in view` along respective axis and direction.

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

	if distanceFromTrigger <= 0
		src = el.getAttribute srcAttrName
		if src
			el.src = src
			el.removeAttribute srcAttrName
			el.removeAttribute 'postpone'


# handoff to client if it supports postpone
if supportsAttr(supportsTestImg, 'postpone')

	Array.prototype.forEach.call document.querySelectorAll('[postpone]'), =>
		el.src = el.getAttribute(srcAttrName)
		el.removeAttribute(srcAttrName)

else

	assessPostopnablity el for el in document.querySelectorAll '[postpone]'

	window.addEventListener 'scroll', (e) ->
		assessPostopnablity el for el in document.querySelectorAll '[postpone]'

	window.addEventListener 'resize', (e) ->
		assessPostopnablity el for el in document.querySelectorAll '[postpone]'
