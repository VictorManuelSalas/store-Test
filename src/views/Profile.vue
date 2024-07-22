<template>
  <section class="page_404">
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <div class="col-sm-18 col-sm-offset-1 text-center">
                        <div class="four_zero_four_bg">
                            <h1 class="text-center">404</h1>
                        </div>
                        <div class="contant_box_404">
                            <h3>¡Oh no!</h3>
                            <p>The page you are trying to access is not available yet</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
  data() {
    return {  };
  },
  mounted() {
     
  },
  methods: {
     
  },
};
</script>

<style>
.page_404{
    padding: 1px 0;
    font-family: "Arvo", serif;
}
.four_zero_four_bg{
    background-image: url('https://github.com/VictorManuelSalas/Simple-404-Error-Page/blob/main/img.gif?raw=true');
    height: 300px;
    background-position: center;
    background-color: white;
}
.four_zero_four_bg h1{
    font-size: 80px;
    text-align: center;
}
.contant_box_404 h3{
    font-size: 50px;
}
.contant_box_404 p{
    font-size: 30px;
}
.link_404{
    color: #fff !important;
    padding: 10px 20px;
    background: #3c3cdd;
    border-radius: 2rem;
    text-decoration: none;
    display: inline-block;
}
.link_404:hover{
    box-shadow: -1px 11px 35px -3px rgba(255,255,255,0.75);
-webkit-box-shadow: -1px 11px 35px -3px rgba(255,255,255,0.75);
-moz-box-shadow: -1px 11px 35px -3px rgba(255,255,255,0.75);
}
.contant_box_404{
    text-align: center;
}
</style>
