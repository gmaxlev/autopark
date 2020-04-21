$(document).ready(function() {
  new WOW().init();

  $(".phone-input").mask("+38 (000) 000 00 00", {
    placeholder: "+38 (___) ___ __ __"
  });

  function showError(error, element) {
    if (
      $(element)
        .parent()
        .find(".input-form-error").length !== 0
    )
      return false;
    if ($(element).attr("name") == "name") {
      message = "Введите имя";
    } else if ($(element).attr("name") == "phone") {
      message = "Введите номер телефона";
    }
    $(element)
      .parent()
      .prepend("<div class='input-form-error'>" + message + "</div>");
    return true;
  }

  function openModal(id) {
    $("#" + id).addClass("modal_show");
    $("body").css("overflow", "hidden");
  }

  function closeModal(id) {
    $("#" + id).addClass("modal_hide");
    setTimeout(function() {
      $("#" + id)
        .removeClass("modal_show")
        .removeClass("modal_hide");
      $("body").css("overflow", "auto");
    }, 800);
  }

  $(".modal__close, .modal__sended-button").on("click", function() {
    var id = $(this)
      .closest(".modal")
      .attr("id");
    closeModal(id);
  });

  $("[data-modal]").on("click", function(e) {
    e.preventDefault();
    var id = $(this).attr("data-modal");
    openModal(id);
  });

  (function() {
    $(".modal-form-type-1").each(function() {
      $(this)
        .submit(function(e) {
          e.preventDefault();
        })
        .validate({
          rules: {
            name: {
              required: {
                depends: function() {
                  $(this).val($.trim($(this).val()));
                  return true;
                }
              }
            },
            phone: {
              required: {
                depends: function() {
                  $(this).val($.trim($(this).val()));
                  return true;
                }
              },
              minlength: 10
            }
          },

          success: function(label, element) {
            $(element)
              .parent()
              .find(".input-form-error")
              .remove();
            return true;
          },
          errorPlacement: showError,
          submitHandler: function(form) {
            $.ajax({
              url: "send.php",
              type: "POST",
              data: {
                form: $(form).attr("name"),
                name: $(form)
                  .find('input[name ="name"]')
                  .val(),
                phone: $(form)
                  .find('input[name ="phone"]')
                  .val()
              },
              success: function() {
                $(form)
                  .closest(".modal")
                  .find(".modal-form")
                  .find("input, button")
                  .prop("disabled", true);
                var modal = (content = $(form).closest(".modal"));
                var content = $(form)
                  .closest(".modal")
                  .find(".modal__content");
                var contentSended = $(form)
                  .closest(".modal")
                  .find(".modal__sended");
                content.addClass("modal__content_send");
                setTimeout(function() {
                  content.hide();
                  contentSended.show();
                  setTimeout(function() {
                    if (
                      !$(modal).hasClass("modal_show") &&
                      !$(modal).hasClass("modal_hide")
                    ) {
                      return;
                    }

                    var id = $(modal).attr("id");
                    closeModal(id);
                  }, 2000);
                }, 500);
              },
              error: function() {
                $(form)
                  .closest(".modal")
                  .find(".modal-form__sendError")
                  .slideDown();
              }
            });
          }
        });
    });
  })();

  /* 
    ============
    Видео отзывы
    ============
  */
  (function() {
    /* 
      ! Для ускорения загрузки на маленьких экранах нужно отключить предварительную загрузку YouTube видео
    */
    var windowWidthDisable = 768;

    /* 
      Список видео
     */
    var reviewsVideos = [
      {
        videoId: "YtDYdvCQLI4", // YouTube ID
        domId: "review-video-1" // DOM id
      },
      {
        videoId: "KreTi0tQmb4",
        domId: "review-video-2"
      },
      {
        videoId: "6Y7mugD20vc",
        domId: "review-video-3"
      },
      {
        videoId: "haPn9IPTttk",
        domId: "review-video-4"
      },
      {
        videoId: "g4IQRkv5vyc",
        domId: "review-video-5"
      }
    ];

    // ==========================================

    if (window.innerWidth < windowWidthDisable) return;

    var loadingStack = [];

    function onLoadVideo() {
      loadingStack.pop();
    }

    var reviewsPlayers = {};

    function onYouTubeIframeAPIReady() {
      for (var i = 0; i < reviewsVideos.length; i++) {
        (function() {
          var domId = reviewsVideos[i]["domId"];
          loadingStack.push(true);
          reviewsPlayers[reviewsVideos[i]["domId"]] = new YT.Player(
            reviewsVideos[i]["domId"],
            {
              height: "100%",
              width: "100%",
              videoId: reviewsVideos[i]["videoId"],
              playerVars: {
                controls: 0,
                disablekb: 1,
                showinfo: 0,
                rel: 0,
                fs: 0,
                showinfo: 0,
                mute: 1,
                autohide: 1,
                modestbranding: 1,
                playlist: reviewsVideos[i]["videoId"],
                loop: 1
              },
              events: {
                onReady: onLoadVideo,
                onStateChange: function(info) {
                  var el = $(
                    '.review__video[data-video-id*="' + domId + '"]'
                  )[0];
                  if (info.data == 1) {
                    $(el).addClass("review__video_play");
                  } else {
                    $(el).removeClass("review__video_play");
                  }
                }
              }
            }
          );
        })();
      }
    }

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    $(".review__video").on("mouseenter", function() {
      if (window.innerWidth < windowWidthDisable) return;
      var id = $(this).attr("data-video-id");
      reviewsPlayers[id].playVideo();
    });

    $(".review__video").on("mouseleave", function() {
      if (window.innerWidth < windowWidthDisable) return;
      var id = $(this).attr("data-video-id");
      reviewsPlayers[id].stopVideo();
    });
  })();
});
