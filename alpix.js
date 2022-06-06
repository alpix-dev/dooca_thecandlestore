let getCouponCode = sessionStorage.getItem('localCouponCode');
let getCouponInfo = sessionStorage.getItem('localCouponInfo');

let textTop = $('.text-top').clone();
textTop.insertBefore('.header');

if($('.page-cart.has-items.page-static.customer-logged-in').length > 0){
    $('.buy-coupon').hide();
    $('.buy-coupon').after('<div id="coupon_custom"><span class="loader_custom"></span><form class="form form-coupon_custom" method="post" action="https://www.thecandlestore.com.br/checkout/cupom"> <div class="row align-items-center position-relative"> <div class="d-none d-sm-block col-12 col-sm-auto"> <label class="label mr-3 mb-0">Possui cupom de desconto?</label><small>Utilize-o abaixo ou na tela de pagamento.</small> </div> <div class="col-12 col-sm mb-3 mb-sm-0"> <input type="text" class="form-control" name="coupon" value="" placeholder="Insira o código"> </div> <div class="col-12 col-sm-auto"> <button type="submit" class="btn btn-secondary"> <span class="text">Aplicar</span> <span class="static-loader"></span> </button> </div> </div> </form><div id="coupon_result"></div></div>');
    //$('.page-cart .card-resume .buy .buy-coupon i').prependTo('#coupon_custom .form .label');
    $('.form-coupon_custom').submit(function(e){
        e.preventDefault();
        var form = $(this);
        var actionUrl = form.attr('action');
        $('#coupon_custom').addClass('loading');
        $.ajax({
            type: "POST",
            url: actionUrl,
            data: form.serialize(),
            success: function(data)
            {
                let result = $(data).find('.block.resume-discount');
                $('#coupon_result').html(result);
                $('#coupon_custom').removeClass('loading');
                sessionStorage.setItem('localCouponCode',$('.form-coupon_custom [name="coupon"]').val());
                sessionStorage.setItem('localCouponInfo',$('#coupon_result').html());
            },
            always: function(){
                $('#coupon_custom').removeClass('loading');
            }
        });
    })
};

if(getCouponCode && getCouponInfo){
    $('.form-coupon_custom [name="coupon"]').val(getCouponCode);
    $('#coupon_result').html(getCouponInfo);

};

if($('.page--product').length > 0){
    $('.product-shipping').after('<div id="product-shipping-results_custom"></div>');
    let clone = $('.product-shipping-form').clone();
    $('.product-shipping-form').hide();
    clone.prepend('<span class="loader_custom"></span>');        
    clone.toggleClass('product-shipping-form product-shipping-form_custom');
    clone.insertAfter('.product-shipping-form');
    
    
    $('.product-shipping-form_custom').submit(function(e){
        e.preventDefault();
        $(this).addClass('loading');
        var form = $(this);
        $.ajax({
            type: "POST",
            url: "/action/product-shipping/get",
            data: form.serialize(),
            success: function(data)
            {
                $('#product-shipping-results_custom').empty();
                $.each(data.data,function(i,option){
                    $('#product-shipping-results_custom').append('<div class="row no-gutters align-items-center w-100 pt-4 px-0 px-sm-3 "> <div class="col-auto" style="width: 2rem; height: 2rem; margin-right: 2rem;"> <input type="radio" name="carrier_id" value="'+ option.id +'"> <span class="checkmark"></span> </div> <div class="col"> <div><b>' + option.alias + '</b></div> <div> até '+ option.delivery_time +' dias úteis </div> </div> <div class="col-auto text-right"> <b>' + parseFloat(option.price).toLocaleString('pt-br',{style: 'currency', currency: 'BRL',maximumFractionDigits: 2}) + '</b> </div> </div>');    
                });
                $('.product-shipping-form_custom').removeClass('loading');
                
                if(sessionStorage.getItem('localCarrier')){
                    $('[name="carrier_id"][value="' + sessionStorage.getItem('localCarrier') + '"]').attr('checked',true);
                }
                console.log(data)
            }
        });
    })

    $('body').on('change','[name="carrier_id"]', function(){
        let carrier_id = $(this).val();
        $.ajax({
            type: "POST",
            url: "/carrinho",
            data: {carrier_id : carrier_id},
            success: function(data)
            {
                console.log('Carrier id ' + carrier_id + ' set');
                sessionStorage.setItem('localCarrier',carrier_id);
            }
        });
    })
};

    
