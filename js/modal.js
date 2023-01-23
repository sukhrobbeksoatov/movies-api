// Modal event
document.addEventListener("click", evt => {
  onModalBtnClick(evt)
  onModalOutsideClick(evt)
  onModalCloseClick(evt)
})

function onModalBtnClick(evt) {
  let elTarget = evt.target.closest("[data-modal-open]")

  if (!elTarget) return
  const modalSelector = elTarget.dataset.modalOpen
  document.querySelector(modalSelector).classList.add("show")
}

function onModalOutsideClick(evt) {
  let elTarget = evt.target

  if (!elTarget.matches("[data-modal]")) return
  elTarget.classList.remove("show")
}

function onModalCloseClick(evt) {
  let elTarget = evt.target.closest("[data-modal-close]")

  if (!elTarget) return

  elTarget.parentElement.parentElement.classList.remove("show")
}