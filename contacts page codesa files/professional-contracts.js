document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".bmpc-faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".bmpc-faq-question");
    const answer = item.querySelector(".bmpc-faq-answer");

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("is-open");
        const otherAnswer = otherItem.querySelector(".bmpc-faq-answer");

        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }
      });

      if (!isOpen) {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});
