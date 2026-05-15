(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('bootstrap')) : typeof define === 'function' && define.amd ? define(['bootstrap'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self,
	global.phoenix = factory(global.bootstrap));
}
)(this, (function(bootstrap) {
	'use strict';

	const docReady = e=>{
			"loading" === document.readyState ? document.addEventListener("DOMContentLoaded", e) : setTimeout(e, 1);
	}
	;
	const toggleColor = (e,t)=>"light" === window.config.config.phoenixTheme ? e : t;
	const resize = e=>window.addEventListener("resize", e);
	const isIterableArray = e=>Array.isArray(e) && !!e.length;
	const camelize = e=>{
			const t = e.replace(/[-_\s.]+(.)?/g, ((e,t)=>t ? t.toUpperCase() : ""));
			return `${t.substr(0, 1).toLowerCase()}${t.substr(1)}`
	}
	;
	const getData = (e,t)=>{
			try {
					return JSON.parse(e.dataset[camelize(t)])
			} catch (o) {
					return e.dataset[camelize(t)]
			}
	}
	;
	const hexToRgb = e=>{
			let t;
			t = 0 === e.indexOf("#") ? e.substring(1) : e;
			const o = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, ((e,t,o,r)=>t + t + o + o + r + r)));
			return o ? [parseInt(o[1], 16), parseInt(o[2], 16), parseInt(o[3], 16)] : null
	}
	;
	const rgbaColor = (e="#fff",t=.5)=>`rgba(${hexToRgb(e)}, ${t})`;
	const getColor = (e,t=document.documentElement)=>getComputedStyle(t).getPropertyValue(`--phoenix-${e}`).trim();
	const hasClass = (e,t)=>e.classList.value.includes(t);
	const addClass = (e,t)=>{
			e.classList.add(t);
	}
	;
	const getOffset = e=>{
			const t = e.getBoundingClientRect()
				, o = window.pageXOffset || document.documentElement.scrollLeft
				, r = window.pageYOffset || document.documentElement.scrollTop;
			return {
					top: t.top + r,
					left: t.left + o
			}
	}
	;
	const isScrolledIntoView = e=>{
			let t = e.offsetTop
				, o = e.offsetLeft;
			const r = e.offsetWidth
				, s = e.offsetHeight;
			for (; e.offsetParent; )
					t += (e = e.offsetParent).offsetTop,
					o += e.offsetLeft;
			return {
					all: t >= window.pageYOffset && o >= window.pageXOffset && t + s <= window.pageYOffset + window.innerHeight && o + r <= window.pageXOffset + window.innerWidth,
					partial: t < window.pageYOffset + window.innerHeight && o < window.pageXOffset + window.innerWidth && t + s > window.pageYOffset && o + r > window.pageXOffset
			}
	}
	;
	const breakpoints = {
			xs: 0,
			sm: 576,
			md: 768,
			lg: 992,
			xl: 1200,
			xxl: 1540
	};
	const getBreakpoint = e=>{
			const t = e && e.classList.value;
			let o;
			return t && (o = breakpoints[t.split(" ").filter((e=>e.includes("navbar-expand-"))).pop().split("-").pop()]),
			o
	}
	;
	const setCookie = (e,t,o)=>{
			const r = new Date;
			r.setTime(r.getTime() + o),
			document.cookie = e + "=" + t + ";expires=" + r.toUTCString();
	}
	;
	const getCookie = e=>{
			var t = document.cookie.match("(^|;) ?" + e + "=([^;]*)(;|$)");
			return t ? t[2] : t
	}
	;
	const settings = {
			tinymce: {
					theme: "oxide"
			},
			chart: {
					borderColor: "rgba(255, 255, 255, 0.8)"
			}
	};
	const newChart = (e,t)=>{
			const o = e.getContext("2d");
			return new window.Chart(o,t)
	}
	;
	const getItemFromStore = (e,t,o=localStorage)=>{
			try {
					return JSON.parse(o.getItem(e)) || t
			} catch {
					return o.getItem(e) || t
			}
	}
	;
	const setItemToStore = (e,t,o=localStorage)=>o.setItem(e, t);
	const getStoreSpace = (e=localStorage)=>parseFloat((escape(encodeURIComponent(JSON.stringify(e))).length / 1048576).toFixed(2));
	const getDates = (e,t,o=864e5)=>{
			const r = (t - e) / o;
			return Array.from({
					length: r + 1
			}, ((t,r)=>new Date(e.valueOf() + o * r)))
	}
	;
	const getPastDates = e=>{
			let t;
			switch (e) {
			case "week":
					t = 7;
					break;
			case "month":
					t = 30;
					break;
			case "year":
					t = 365;
					break;
			default:
					t = e;
			}
			const o = new Date
				, r = o
				, s = new Date((new Date).setDate(o.getDate() - (t - 1)));
			return getDates(s, r)
	}
	;
	const getRandomNumber = (e,t)=>Math.floor(Math.random() * (t - e) + e);
	var utils = {
			docReady: docReady,
			toggleColor: toggleColor,
			resize: resize,
			isIterableArray: isIterableArray,
			camelize: camelize,
			getData: getData,
			hasClass: hasClass,
			addClass: addClass,
			hexToRgb: hexToRgb,
			rgbaColor: rgbaColor,
			getColor: getColor,
			breakpoints: breakpoints,
			getOffset: getOffset,
			isScrolledIntoView: isScrolledIntoView,
			getBreakpoint: getBreakpoint,
			setCookie: setCookie,
			getCookie: getCookie,
			newChart: newChart,
			settings: settings,
			getItemFromStore: getItemFromStore,
			setItemToStore: setItemToStore,
			getStoreSpace: getStoreSpace,
			getDates: getDates,
			getPastDates: getPastDates,
			getRandomNumber: getRandomNumber
	};

	const docComponentInit = ()=>{
			const e = document.querySelectorAll("[data-component-card]")
				, o = document.getElementById("icon-copied-toast")
				, t = new bootstrap.Toast(o);
			e.forEach((e=>{
					const c = e.querySelector(".copy-code-btn")
						, n = e.querySelector(".code-to-copy")
						, d = e.querySelector(".preview-btn")
						, r = e.querySelector(".code-collapse")
						, l = bootstrap.Collapse.getOrCreateInstance(r, {
							toggle: !1
					});
					d?.addEventListener("click", (()=>{
							l.toggle();
					}
					)),
					c?.addEventListener("click", (()=>{
							const e = document.createElement("textarea");
							e.value = n.innerHTML,
							document.body.appendChild(e),
							e.select(),
							document.execCommand("copy"),
							document.body.removeChild(e),
							o.querySelector(".toast-body").innerHTML = "<code class='text-500'>Code has been copied to clipboard.</code>",
							t.show();
					}
					));
			}
			));
	}
	;

	const orders = [{
			id: 1,
			dropdownId: "order-dropdown-1",
			orderId: "#2181",
			mailLink: "mailto:carry@example.com",
			customer: "Carry Anna",
			date: "10/03/2023",
			address: "Carry Anna, 2392 Main Avenue, Penasauka, New Jersey 02149",
			deliveryType: "Cash on Delivery",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$99"
	}, {
			id: 2,
			dropdownId: "order-dropdown-2",
			orderId: "#2182",
			mailLink: "mailto:milind@example.com",
			customer: "Milind Mikuja",
			date: "10/03/2023",
			address: "Milind Mikuja, 1 Hollywood Blvd,Beverly Hills, California 90210",
			deliveryType: "Cash on Delivery",
			status: "Processing",
			badge: {
					type: "primary",
					icon: "fas fa-redo"
			},
			amount: "$120"
	}, {
			id: 3,
			dropdownId: "order-dropdown-3",
			orderId: "#2183",
			mailLink: "mailto:stanly@example.com",
			customer: "Stanly Drinkwater",
			date: "30/04/2023",
			address: "Stanly Drinkwater, 1 Infinite Loop, Cupertino, California 90210",
			deliveryType: "Local Delivery",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$70"
	}, {
			id: 4,
			dropdownId: "order-dropdown-4",
			orderId: "#2184",
			mailLink: "mailto:bucky@example.com",
			customer: "Bucky Robert",
			date: "30/04/2023",
			address: "Bucky Robert, 1 Infinite Loop, Cupertino, California 90210",
			deliveryType: "Free Shipping",
			status: "Pending",
			badge: {
					type: "warning",
					icon: "fas fa-stream"
			},
			amount: "$92"
	}, {
			id: 5,
			dropdownId: "order-dropdown-5",
			orderId: "#2185",
			mailLink: "mailto:josef@example.com",
			customer: "Josef Stravinsky",
			date: "30/04/2023",
			address: "Josef Stravinsky, 1 Infinite Loop, Cupertino, California 90210",
			deliveryType: "Via Free Road",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$120"
	}, {
			id: 6,
			dropdownId: "order-dropdown-6",
			orderId: "#2186",
			mailLink: "mailto:igor@example.com",
			customer: "Igor Borvibson",
			date: "30/04/2023",
			address: "Igor Borvibson, 1 Infinite Loop, Cupertino, California 90210",
			deliveryType: "Free Shipping",
			status: "Processing",
			badge: {
					type: "primary",
					icon: "fas fa-redo"
			},
			amount: "$145"
	}, {
			id: 7,
			dropdownId: "order-dropdown-7",
			orderId: "#2187",
			mailLink: "mailto:katerina@example.com",
			customer: "Katerina Karenin",
			date: "30/04/2023",
			address: "Katerina Karenin, 1 Infinite Loop, Cupertino, California 90210",
			deliveryType: "Flat Rate",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$55"
	}, {
			id: 8,
			dropdownId: "order-dropdown-8",
			orderId: "#2188",
			mailLink: "mailto:roy@example.com",
			customer: "Roy Anderson",
			date: "29/04/2023",
			address: "Roy Anderson, 1 Infinite Loop, Cupertino, California 90210",
			deliveryType: "Local Delivery",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$90"
	}, {
			id: 9,
			dropdownId: "order-dropdown-9",
			orderId: "#2189",
			mailLink: "mailto:Stephenson@example.com",
			customer: "Thomas Stephenson",
			date: "29/04/2023",
			address: "Thomas Stephenson, 116 Ballifeary Road, Bamff",
			deliveryType: "Flat Rate",
			status: "Processing",
			badge: {
					type: "primary",
					icon: "fas fa-redo"
			},
			amount: "$52"
	}, {
			id: 10,
			dropdownId: "order-dropdown-10",
			orderId: "#2190",
			mailLink: "mailto:eviewsing@example.com",
			customer: "Evie Singh",
			date: "29/04/2023",
			address: "Evie Singh, 54 Castledore Road, Tunstead",
			deliveryType: "Flat Rate",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$90"
	}, {
			id: 11,
			dropdownId: "order-dropdown-11",
			orderId: "#2191",
			mailLink: "mailto:peter@example.com",
			customer: "David Peters",
			date: "29/04/2023",
			address: "David Peters, Rhyd Y Groes, Rhosgoch, LL66 0AT",
			deliveryType: "Local Delivery",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$69"
	}, {
			id: 12,
			dropdownId: "order-dropdown-12",
			orderId: "#2192",
			mailLink: "mailto:jennifer@example.com",
			customer: "Jennifer Johnson",
			date: "28/04/2023",
			address: "Jennifer Johnson, Rhyd Y Groes, Rhosgoch, LL66 0AT",
			deliveryType: "Flat Rate",
			status: "Processing",
			badge: {
					type: "primary",
					icon: "fas fa-redo"
			},
			amount: "$112"
	}, {
			id: 13,
			dropdownId: "order-dropdown-13",
			orderId: "#2193",
			mailLink: "mailto:okuneva@example.com",
			customer: "Demarcus Okuneva",
			date: "28/04/2023",
			address: "Demarcus Okuneva, 90555 Upton Drive Jeffreyview, UT 08771",
			deliveryType: "Flat Rate",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$99"
	}, {
			id: 14,
			dropdownId: "order-dropdown-14",
			orderId: "#2194",
			mailLink: "mailto:simeon@example.com",
			customer: "Simeon Harber",
			date: "27/04/2023",
			address: "Simeon Harber, 702 Kunde Plain Apt. 634 East Bridgetview, HI 13134-1862",
			deliveryType: "Free Shipping",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$129"
	}, {
			id: 15,
			dropdownId: "order-dropdown-15",
			orderId: "#2195",
			mailLink: "mailto:lavon@example.com",
			customer: "Lavon Haley",
			date: "27/04/2023",
			address: "Lavon Haley, 30998 Adonis Locks McGlynnside, ID 27241",
			deliveryType: "Free Shipping",
			status: "Pending",
			badge: {
					type: "warning",
					icon: "fas fa-stream"
			},
			amount: "$70"
	}, {
			id: 16,
			dropdownId: "order-dropdown-16",
			orderId: "#2196",
			mailLink: "mailto:ashley@example.com",
			customer: "Ashley Kirlin",
			date: "26/04/2023",
			address: "Ashley Kirlin, 43304 Prosacco Shore South Dejuanfurt, MO 18623-0505",
			deliveryType: "Local Delivery",
			status: "Processing",
			badge: {
					type: "primary",
					icon: "fas fa-redo"
			},
			amount: "$39"
	}, {
			id: 17,
			dropdownId: "order-dropdown-17",
			orderId: "#2197",
			mailLink: "mailto:johnnie@example.com",
			customer: "Johnnie Considine",
			date: "26/04/2023",
			address: "Johnnie Considine, 6008 Hermann Points Suite 294 Hansenville, TN 14210",
			deliveryType: "Flat Rate",
			status: "Pending",
			badge: {
					type: "warning",
					icon: "fas fa-stream"
			},
			amount: "$70"
	}, {
			id: 18,
			dropdownId: "order-dropdown-18",
			orderId: "#2198",
			mailLink: "mailto:trace@example.com",
			customer: "Trace Farrell",
			date: "26/04/2023",
			address: "Trace Farrell, 431 Steuber Mews Apt. 252 Germanland, AK 25882",
			deliveryType: "Free Shipping",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$70"
	}, {
			id: 19,
			dropdownId: "order-dropdown-19",
			orderId: "#2199",
			mailLink: "mailto:nienow@example.com",
			customer: "Estell Nienow",
			date: "26/04/2023",
			address: "Estell Nienow, 4167 Laverna Manor Marysemouth, NV 74590",
			deliveryType: "Free Shipping",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$59"
	}, {
			id: 20,
			dropdownId: "order-dropdown-20",
			orderId: "#2200",
			mailLink: "mailto:howe@example.com",
			customer: "Daisha Howe",
			date: "25/04/2023",
			address: "Daisha Howe, 829 Lavonne Valley Apt. 074 Stehrfort, RI 77914-0379",
			deliveryType: "Free Shipping",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$39"
	}, {
			id: 21,
			dropdownId: "order-dropdown-21",
			orderId: "#2201",
			mailLink: "mailto:haley@example.com",
			customer: "Miles Haley",
			date: "24/04/2023",
			address: "Miles Haley, 53150 Thad Squares Apt. 263 Archibaldfort, MO 00837",
			deliveryType: "Flat Rate",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$55"
	}, {
			id: 22,
			dropdownId: "order-dropdown-22",
			orderId: "#2202",
			mailLink: "mailto:watsica@example.com",
			customer: "Brenda Watsica",
			date: "24/04/2023",
			address: "Brenda Watsica, 9198 O'Kon Harbors Morarborough, IA 75409-7383",
			deliveryType: "Free Shipping",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$89"
	}, {
			id: 23,
			dropdownId: "order-dropdown-23",
			orderId: "#2203",
			mailLink: "mailto:ellie@example.com",
			customer: "Ellie O'Reilly",
			date: "24/04/2023",
			address: "Ellie O'Reilly, 1478 Kaitlin Haven Apt. 061 Lake Muhammadmouth, SC 35848",
			deliveryType: "Free Shipping",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$47"
	}, {
			id: 24,
			dropdownId: "order-dropdown-24",
			orderId: "#2204",
			mailLink: "mailto:garry@example.com",
			customer: "Garry Brainstrow",
			date: "23/04/2023",
			address: "Garry Brainstrow, 13572 Kurt Mews South Merritt, IA 52491",
			deliveryType: "Free Shipping",
			status: "Completed",
			badge: {
					type: "success",
					icon: "fas fa-check"
			},
			amount: "$139"
	}, {
			id: 25,
			dropdownId: "order-dropdown-25",
			orderId: "#2205",
			mailLink: "mailto:estell@example.com",
			customer: "Estell Pollich",
			date: "23/04/2023",
			address: "Estell Pollich, 13572 Kurt Mews South Merritt, IA 52491",
			deliveryType: "Free Shipping",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$49"
	}, {
			id: 26,
			dropdownId: "order-dropdown-26",
			orderId: "#2206",
			mailLink: "mailto:ara@example.com",
			customer: "Ara Mueller",
			date: "23/04/2023",
			address: "Ara Mueller, 91979 Kohler Place Waelchiborough, CT 41291",
			deliveryType: "Flat Rate",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$19"
	}, {
			id: 27,
			dropdownId: "order-dropdown-27",
			orderId: "#2207",
			mailLink: "mailto:blick@example.com",
			customer: "Lucienne Blick",
			date: "23/04/2023",
			address: "Lucienne Blick, 6757 Giuseppe Meadows Geraldinemouth, MO 48819-4970",
			deliveryType: "Flat Rate",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$59"
	}, {
			id: 28,
			dropdownId: "order-dropdown-28",
			orderId: "#2208",
			mailLink: "mailto:haag@example.com",
			customer: "Laverne Haag",
			date: "22/04/2023",
			address: "Laverne Haag, 2327 Kaylee Mill East Citlalli, AZ 89582-3143",
			deliveryType: "Flat Rate",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$49"
	}, {
			id: 29,
			dropdownId: "order-dropdown-29",
			orderId: "#2209",
			mailLink: "mailto:bednar@example.com",
			customer: "Brandon Bednar",
			date: "22/04/2023",
			address: "Brandon Bednar, 25156 Isaac Crossing Apt. 810 Lonborough, CO 83774-5999",
			deliveryType: "Flat Rate",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$39"
	}, {
			id: 30,
			dropdownId: "order-dropdown-30",
			orderId: "#2210",
			mailLink: "mailto:dimitri@example.com",
			customer: "Dimitri Boehm",
			date: "23/04/2023",
			address: "Dimitri Boehm, 71603 Wolff Plains Apt. 885 Johnstonton, MI 01581",
			deliveryType: "Flat Rate",
			status: "On Hold",
			badge: {
					type: "secondary",
					icon: "fas fa-ban"
			},
			amount: "$111"
	}]
		, advanceAjaxTableInit = ()=>{
			const e = (e,a)=>{
					e.disabled = a,
					e.classList[a ? "add" : "remove"]("disabled");
			}
				, a = document.getElementById("advanceAjaxTable");
			if (a) {
					const d = {
							page: 10,
							pagination: {
									item: "<li><button class='page' type='button'></button></li>"
							},
							item: e=>{
									const {orderId: a, id: d, customer: o, date: r, address: n, deliveryType: t, status: i, badge: s, amount: l} = e;
									return `\n          <tr class="btn-reveal-trigger">\n            <td class="order py-2  ps-3 align-middle white-space-nowrap">\n              <a class="fw-semi-bold" href="https://prium.github.io/phoenix/v1.12.0/apps/e-commerce/admin/order-details.html">\n                ${a}\n              </a>\n            </td>\n            <td class="py-2 align-middle fw-bold">\n              <a class="fw-semi-bold text-900" href="#!">\n                ${o}\n              </a>\n            </td>\n            <td class="py-2 align-middle">\n              ${r}\n            </td>\n            <td class="py-2 align-middle white-space-nowrap">\n              ${n}\n            </td>\n            <td class="py-2 align-middle white-space-nowrap">\n              <p class="mb-0">${t}</p>\n            </td>\n            <td class="py-2 align-middle text-center fs-0 white-space-nowrap">\n              <span class="badge fs--2 badge-phoenix badge-phoenix-${s.type}">\n                ${i}\n                <span class="ms-1 ${s.icon}" data-fa-transform="shrink-2"></span>\n              </span>\n            </td>\n            <td class="py-2 align-middle text-end fs-0 fw-medium">\n              ${l}\n            </td>\n            <td class="py-2 align-middle white-space-nowrap text-end">\n              <div class="dropstart font-sans-serif position-static d-inline-block">\n                <button class="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal" type='button' id="order-dropdown-${d}" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent">\n                  <span class="fas fa-ellipsis-h fs--1"></span>\n                </button>\n                <div class="dropdown-menu dropdown-menu-end border py-2" aria-labelledby="order-dropdown-${d}">\n                  <a href="#!" class="dropdown-item">View</a>\n                  <a href="#!" class="dropdown-item">Edit</a>\n                  <div class"dropdown-divider"></div>\n                  <a href="#!" class="dropdown-item text-warning">Archive</a>\n                </div>\n        
